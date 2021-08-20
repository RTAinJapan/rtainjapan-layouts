import {setInterval} from "timers";
import {NodeCG} from "../nodecg";
import got from "got";
import sampleSchedule from "./oengus-sample-schedule.json";
import sampleSubmission from "./oengus-sample-submissions.json";
import moment from "moment";
import {Participant} from "../../nodecg/replicants";
import {google} from "googleapis";
import {padStart, zipObject} from "lodash";

// TODO: make these selectable from dashboard
const MARATHON_ID = "rtaij2021s";
const NICO_ANSWER_ID = 1548;

const fetchSchedule = async (): Promise<typeof sampleSchedule> => {
	const res = await got.get(
		`https://oengus.io/api/marathons/${MARATHON_ID}/schedule`,
		{json: true},
	);
	return res.body;
};
const fetchSubmissions = async (
	token: string,
): Promise<typeof sampleSubmission> => {
	const res = await got.get(
		`https://oengus.io/api/marathons/${MARATHON_ID}/submissions`,
		{
			json: true,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return res.body;
};

const padZero = (num: number) => {
	return padStart(String(num), 2, "0");
};

const formatDuration = (duration: string) => {
	const momentDuration = moment.duration(duration);
	const hours = momentDuration.hours();
	const minutes = momentDuration.minutes();
	const seconds = momentDuration.seconds();
	return `${hours}:${padZero(minutes)}:${padZero(seconds)}`;
};

const extractNicoId = (str?: string | null) => {
	const regexResult = str?.match(/co\d+/);
	if (regexResult) {
		return regexResult[0];
	}
	return undefined;
};

export const importFromOengus = (nodecg: NodeCG) => {
	const logger = new nodecg.Logger("schedule:oengus");
	const {oengus, googleApiKey} = nodecg.bundleConfig;
	if (!oengus) {
		logger.warn("Oengus config is empty");
		return;
	}
	if (!googleApiKey) {
		logger.warn("Google API key config is empty");
		return;
	}

	const sheetsApi = google.sheets({
		version: "v4",
		auth: googleApiKey,
	});
	const fetchCommentators = async () => {
		const res = await sheetsApi.spreadsheets.values.batchGet({
			spreadsheetId: oengus.commentatorSheet,
			ranges: ["解説応募"],
		});
		const sheetValues = res.data.valueRanges;
		if (!sheetValues?.[0]?.values) {
			throw new Error("Could not get values from spreadsheet");
		}
		const [labels, ...contents] = sheetValues[0].values;
		if (!labels) {
			throw new Error("Could not get values from spreadsheet");
		}
		const rawData = contents.map((content) => zipObject(labels, content));
		return rawData.map((el) => {
			return {
				name: el["名前"],
				twitter: el["Twitter ID"],
				twitch: el["Twitch ID"],
				nico: el["ニコニココミュニティ ID"],
				gameCategory: el["担当ゲームカテゴリ"],
			};
		});
	};
	const fetchAddtionalGameInfo = async () => {
		const res = await sheetsApi.spreadsheets.values.batchGet({
			spreadsheetId: oengus.additionalGameInfoSheet,
			ranges: ["main"],
		});
		const sheetValues = res.data.valueRanges;
		if (!sheetValues?.[0]?.values) {
			throw new Error("Could not get values from spreadsheet");
		}
		const [labels, ...contents] = sheetValues[0].values;
		if (!labels) {
			throw new Error("Could not get values from spreadsheet");
		}
		const rawData = contents.map((content) => zipObject(labels, content));
		return new Map(
			rawData.map((el) => {
				return [
					parseInt(el["categoryId"]),
					{
						twitchCategory: el["twitchCategory"] as string,
						releaseYear: parseInt(el["releaseYear"]),
					},
				];
			}),
		);
	};

	logger.warn("Using Oengus to import schedule");

	const scheduleRep = nodecg.Replicant("schedule");
	const warnedMissingCategoryId = new Set<number>();

	const updateSchedule = async () => {
		try {
			const [schedule, submissions, rawCommentators, additionalGameInfo] =
				await Promise.all([
					fetchSchedule(),
					fetchSubmissions(oengus.token),
					fetchCommentators(),
					fetchAddtionalGameInfo(),
				]);
			scheduleRep.value = schedule.lines.map((run, index) => {
				const runners: Participant[] = run.runners.map((runner) => {
					const answer = submissions
						.find((sub) => sub.user.id === runner.id)
						?.answers.find((e) => e.question.id === NICO_ANSWER_ID);
					return {
						name: runner.usernameJapanese || runner.username,
						twitch:
							runner.connections.find((c) => c.platform === "TWITCH")
								?.username || undefined,
						twitter:
							runner.connections.find((c) => c.platform === "TWITTER")
								?.username || undefined,
						nico: extractNicoId(answer?.answer) || undefined,
						camera: false, // TODO: スプレッドシートから取得する必要アリ
					};
				});
				const gameCategory =
					run.gameName.trim() + " - " + run.categoryName.trim();
				const commentators = rawCommentators.filter(
					(c) => c.gameCategory === gameCategory,
				);
				const additionalInfo = additionalGameInfo.get(run.categoryId);
				if (!additionalInfo && !warnedMissingCategoryId.has(run.categoryId)) {
					warnedMissingCategoryId.add(run.categoryId);
					logger.warn(
						`Cannot find ${run.gameName} (${run.categoryId}) from additional info sheet`,
					);
				}
				return {
					pk: run.id,
					index,
					title: run.gameName,
					englishTitle: additionalInfo?.twitchCategory || "",
					category: run.categoryName,
					platform: run.console,
					runDuration: formatDuration(run.estimate),
					setupDuration: formatDuration(run.setupTime),
					runners,
					camera: true, // TODO: ゲーム全体の初期値決定方法を決める必要あり
					releaseYear: additionalInfo?.releaseYear,
					commentators: commentators.map((c) => ({
						name: c.name,
						twitch: c.twitch,
						twitter: c.twitter,
						nico: c.nico,
					})),
				};
			});
		} catch (error) {
			logger.error("Failed to fetch schedule");
			logger.error(error);
		}
	};

	updateSchedule();
	setInterval(updateSchedule, 10 * 1000);
};
