import {NodeCG} from "./nodecg";
import {klona as clone} from "klona/json";

export default async (nodecg: NodeCG) => {
	const scheduleRep = nodecg.Replicant("schedule");
	const currentRunRep = nodecg.Replicant("current-run");
	const nextRunRep = nodecg.Replicant("next-run");
	const timerRep = nodecg.Replicant("timer");
	const audioAssignmentRep = nodecg.Replicant("audio-assignment");
	// 最後のゲームの次 (閉幕) に進んだ状態。current-run は最後のゲームのまま保持し、
	// このフラグでグラフィクスのゲーム表示を消す (#768)。current-run / schedule の
	// 既存ロジック (空の自動復帰など) には手を入れないための専用レプリカント。
	const endingRep = nodecg.Replicant("ending");

	const updateCurrentRun = (index: number) => {
		if (timerRep.value?.timerState === "Running") {
			return;
		}
		if (!scheduleRep.value) {
			return;
		}
		const newCurrentRun = scheduleRep.value[index];
		if (!newCurrentRun) {
			return;
		}
		currentRunRep.value = clone(newCurrentRun);
		nextRunRep.value = clone(scheduleRep.value[index + 1]);
		// 実在の run を選び直したので閉幕表示は解除する。
		endingRep.value = false;
	};

	const seekToNextRun = () => {
		if (timerRep.value?.timerState === "Running") {
			return;
		}
		if (!currentRunRep.value || !scheduleRep.value) {
			return;
		}
		const currentIndex = currentRunRep.value.index;
		if (currentIndex === undefined || currentIndex < 0) {
			updateCurrentRun(0);
			return;
		}
		if (currentIndex >= scheduleRep.value.length - 1) {
			// 最後のゲームで「次へ」→ 閉幕表示へ。current-run は最後のゲームのまま
			// 保持し、ending フラグでグラフィクスの「次のゲーム」表示を消す。
			// 「前へ」で ending を解除すれば元の表示に戻る (seekToPreviousRun)。
			endingRep.value = true;
			return;
		}
		currentRunRep.value = clone(nextRunRep.value);
		nextRunRep.value = clone(scheduleRep.value[currentIndex + 2]);

		// 「次へ」で run が進んだら audio-assignment も next → current に繰り上げ、
		// next は空で初期化する (新 next のセットアップ時に再入力する)。
		// run 繰り上げと同じトランザクションで行うことで一貫性を保つ。
		// 前へ / 任意ジャンプは seekToNextRun を経由しないので追従しない。
		const asg = audioAssignmentRep.value;
		if (asg) {
			audioAssignmentRep.value = {
				current: {
					deck: asg.next?.deck ?? null,
					runners: [...(asg.next?.runners ?? [])],
					commentators: [...(asg.next?.commentators ?? [])],
					games: [...(asg.next?.games ?? [])],
				},
				next: {deck: null, runners: [], commentators: [], games: []},
			};
		}
	};

	const seekToPreviousRun = () => {
		if (timerRep.value?.timerState === "Running") {
			return;
		}
		if (!currentRunRep.value || !scheduleRep.value) {
			return;
		}
		// 閉幕表示中なら、「前へ」で表示を元 (最後のゲーム) に戻すだけ。
		if (endingRep.value) {
			endingRep.value = false;
			return;
		}
		const currentIndex = currentRunRep.value.index;
		if (currentIndex === undefined || currentIndex < 0) {
			updateCurrentRun(0);
			return;
		}
		if (currentIndex === 0) {
			return;
		}
		nextRunRep.value = clone(currentRunRep.value);
		currentRunRep.value = clone(scheduleRep.value[currentIndex - 1]);
	};

	const refreshRun = (deck: "current" | "next") => {
		const targetRep = deck === "current" ? currentRunRep : nextRunRep;
		if (!targetRep.value) {
			return;
		}
		const index = targetRep.value.index;
		const freshRun = scheduleRep.value?.find((r) => r.index === index);
		targetRep.value = clone(freshRun);
	};

	nodecg.listenFor("nextRun", (_, cb) => {
		seekToNextRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("previousRun", (_, cb) => {
		seekToPreviousRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("setCurrentRunByIndex", (index, cb) => {
		updateCurrentRun(index);
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("modifyRun", (data, cb) => {
		let msg: string | null = null;

		try {
			if (currentRunRep.value && currentRunRep.value.pk === data.pk) {
				currentRunRep.value = {...currentRunRep.value, ...data};
			} else if (nextRunRep.value && nextRunRep.value.pk === data.pk) {
				nextRunRep.value = {...nextRunRep.value, ...data};
			} else {
				nodecg.log.warn("[modifyRun] run not found:", data);
				msg = "Error: Run not found";
			}

			if (cb && !cb.handled) {
				cb(msg);
			}
		} catch (error) {
			if (cb && !cb.handled) {
				cb(error instanceof Error ? error.message : "error");
			}
		}
	});

	nodecg.listenFor("refreshRun", (deck, cb) => {
		refreshRun(deck);
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	// Prevent empty current run
	scheduleRep.on("change", (newVal) => {
		const isCurrentRunEmpty = !currentRunRep.value || !currentRunRep.value.pk;
		if (isCurrentRunEmpty) {
			const currentRun = newVal[0];
			if (currentRun) {
				currentRunRep.value = clone(currentRun);
				nextRunRep.value = clone(newVal[1]);
			}
		}
	});
};
