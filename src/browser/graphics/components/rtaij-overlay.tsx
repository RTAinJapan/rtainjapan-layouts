import delay from "delay";
import React, {useEffect, useRef, useState} from "react";
import styled, {css} from "styled-components";
import sample from "lodash/sample";

import {Tweet} from "./lib/tweet";

import blueLogoR from "../images/logo/blue/index.png";
import blueLogoTainjapan from "../images/logo/blue/tainjapan.png";
import blueLogoAnim0 from "../images/logo/blue/animated-0.gif";
import blueLogoAnim1 from "../images/logo/blue/animated-1.gif";
import blueLogoAnim2 from "../images/logo/blue/animated-2.gif";
import blueLogoAnim3 from "../images/logo/blue/animated-3.gif";
import blueLogoAnim4 from "../images/logo/blue/animated-4.gif";
import blueLogoAnim5 from "../images/logo/blue/animated-5.gif";
import blueLogoAnim6 from "../images/logo/blue/animated-6.gif";
import blueLogoAnim7 from "../images/logo/blue/animated-7.gif";
import blueLogoAnim8 from "../images/logo/blue/animated-8.gif";
import blueLogoAnim9 from "../images/logo/blue/animated-9.gif";

import brownLogoR from "../images/logo/brown/index.png";
import brownLogoTainjapan from "../images/logo/brown/tainjapan.png";
import brownLogoAnim0 from "../images/logo/brown/animated-0.gif";
import brownLogoAnim1 from "../images/logo/brown/animated-1.gif";
import brownLogoAnim2 from "../images/logo/brown/animated-2.gif";
import brownLogoAnim3 from "../images/logo/brown/animated-3.gif";
import brownLogoAnim4 from "../images/logo/brown/animated-4.gif";
import brownLogoAnim5 from "../images/logo/brown/animated-5.gif";
import brownLogoAnim6 from "../images/logo/brown/animated-6.gif";
import brownLogoAnim7 from "../images/logo/brown/animated-7.gif";
import brownLogoAnim8 from "../images/logo/brown/animated-8.gif";
import brownLogoAnim9 from "../images/logo/brown/animated-9.gif";

const {colorTheme, hasSponsor, sponsor = []} = nodecg.bundleConfig;

const logos = (() => {
	switch (colorTheme) {
		case undefined:
		case "blue":
			return {
				logoR: blueLogoR,
				logoAnim: [
					blueLogoAnim0,
					blueLogoAnim1,
					blueLogoAnim2,
					blueLogoAnim3,
					blueLogoAnim4,
					blueLogoAnim5,
					blueLogoAnim6,
					blueLogoAnim7,
					blueLogoAnim8,
					blueLogoAnim9,
				],
				logoTainjapan: blueLogoTainjapan,
			};
		case "brown":
			return {
				logoR: brownLogoR,
				logoAnim: [
					brownLogoAnim0,
					brownLogoAnim1,
					brownLogoAnim2,
					brownLogoAnim3,
					brownLogoAnim4,
					brownLogoAnim5,
					brownLogoAnim6,
					brownLogoAnim7,
					brownLogoAnim8,
					brownLogoAnim9,
				],
				logoTainjapan: brownLogoTainjapan,
			};
	}
})();

const LOGO_TRANSFORM_DURATION_SECONDS = 1;

const Container = styled.div`
	position: absolute;
	width: 1920px;
	height: 1080px;
	z-index: 0;
`;

const Top = styled.div`
	position: absolute;
	height: 150px;
	width: 100%;
	top: 0;
	${colorTheme === "blue"
		? css`
				background-color: rgba(0, 10, 60, 0.6);
		  `
		: css`
				background-color: rgba(27, 20, 8, 0.6);
		  `}
	${({theme}) =>
		theme.isBreak &&
		css`
			background: none;
		`};
`;

const Bottom = styled.div`
	position: absolute;
	width: 100%;
	bottom: 0;
	${colorTheme === "blue"
		? css`
				background-color: rgba(0, 10, 60, 0.5);
		  `
		: css`
				background-color: rgba(27, 20, 8, 0.5);
		  `}
`;

const LogoR = styled.img`
	position: absolute;
	z-index: 2;
`;

const LogoTaContainer = styled.div`
	position: absolute;
	z-index: 1;
	top: 15px;
	left: 90px;
	overflow: hidden;
`;

const LogoTainjapan = styled.img`
	transition: transform ${LOGO_TRANSFORM_DURATION_SECONDS}s;
	will-change: transform;
	${(props: {translated: boolean}) =>
		props.translated &&
		css`
			transform: translate(-100%, 0);
		`};
`;

type SponsporProps = {
	left?: boolean;
};
const Sponsor = styled.div`
	position: absolute;
	height: 100%;
	width: 210px;
	background: white no-repeat center;
	box-sizing: border-box;
	padding: 15px;

	${(props: SponsporProps) =>
		props.left
			? css`
					left: 0px;
					border-top-right-radius: 30px;
			  `
			: css`
					right: 0px;
					border-top-left-radius: 30px;
			  `}

	display: grid;
	justify-items: center;
	justify-content: center;
	align-items: center;
	align-content: center;
`;

const sponsorLogoStyle = css`
	grid-row: 1 / 2;
	grid-column: 1 / 2;
	opacity: 0;
	transition: opacity 0.8s;
`;
const SponsorImage = styled.img`
	${sponsorLogoStyle}
`;
const SponsorVideo = styled.video`
	${sponsorLogoStyle}
`;

interface Props {
	isBreak?: boolean;
	bottomHeightPx: number;
	TweetProps?: {
		widthPx?: number;
		leftAttached?: boolean;
		rowDirection?: boolean;
		hideLogo?: boolean;
		maxHeightPx?: number;
	};
	sponsorLeft?: boolean;
}

const useSponsorLogo = (currentlyShowingLogoIndex: number) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [readyElements, setReadyElements] = useState(0);
	console.log(readyElements);

	const elements = sponsor.map(({url, type}, index) => {
		const shouldShow = currentlyShowingLogoIndex % sponsor.length === index;

		switch (type) {
			case "image": {
				return (
					<SponsorImage
						key={url}
						src={url}
						style={{
							opacity: readyElements >= sponsor.length && shouldShow ? 1 : 0,
						}}
						onLoad={() => {
							setReadyElements((value) => value + 1);
						}}
					></SponsorImage>
				);
			}
			case "video": {
				return (
					<SponsorVideo
						width={210 * 1.5}
						height={150 * 1.5}
						key={url}
						src={url}
						style={{
							opacity: readyElements >= sponsor.length && shouldShow ? 1 : 0,
						}}
						ref={videoRef}
						autoPlay={false}
						preload='auto'
						controls={false}
						loop={false}
						onCanPlayThrough={() => {
							setReadyElements((value) => value + 1);
						}}
					></SponsorVideo>
				);
			}
		}
	});

	return {elements, videoRef};
};

export const RtaijOverlay: React.FunctionComponent<Props> = (props) => {
	const [logoR, setLogoR] = useState(logos.logoR);
	const [logoRestTransformed, setLogoRestTransformed] = useState(false);
	const [currentSponsorLogoIndex, setCurrentSponsorLogoIndex] = useState(0);
	const {elements: sponsorElements, videoRef} = useSponsorLogo(
		currentSponsorLogoIndex,
	);

	useEffect(() => {
		const interval = setInterval(async () => {
			const randomGif = sample(logos.logoAnim);
			if (!randomGif) {
				return;
			}
			setLogoR(randomGif);
			await delay(5000);
			setLogoR(logos.logoR);
		}, 77 * 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!sponsor) {
				return;
			}
			setCurrentSponsorLogoIndex((value) => value + 1);
			await delay(1000);
			if (videoRef.current) {
				videoRef.current.currentTime = 0;
				videoRef.current.play();
			}
		}, 12 * 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	const beforeShowingTweet = async () => {
		if (props.TweetProps?.hideLogo) {
			setLogoRestTransformed(true);
			await delay(LOGO_TRANSFORM_DURATION_SECONDS * 1000);
		}
	};

	const afterShowingTweet = async () => {
		if (props.TweetProps?.hideLogo) {
			setLogoRestTransformed(false);
			await delay(LOGO_TRANSFORM_DURATION_SECONDS * 1000);
		}
	};

	return (
		<Container>
			<Top theme={{isBreak: props.isBreak}}>
				<LogoR src={logoR} />
				<LogoTaContainer>
					<LogoTainjapan
						translated={logoRestTransformed}
						src={logos.logoTainjapan}
					/>
				</LogoTaContainer>
			</Top>
			<Bottom style={{height: `${props.bottomHeightPx}px`}}>
				{hasSponsor && sponsor && (
					<Sponsor left={props.sponsorLeft}>{sponsorElements}</Sponsor>
				)}
			</Bottom>
			<Tweet
				{...props.TweetProps}
				beforeShowingTweet={beforeShowingTweet}
				afterShowingTweet={afterShowingTweet}
			/>
		</Container>
	);
};
