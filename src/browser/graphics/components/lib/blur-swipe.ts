import gsap from "gsap";
import {RefObject} from "react";

export const blurSwipe = {
	enter: {
		from: "linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,0) 0%)",
		to: "linear-gradient(to right, rgba(0,0,0,1) 100%, rgba(0,0,0,0) 120%)",
	},
	exit: {
		from: "linear-gradient(to right, rgba(0,0,0,0) -20%, rgba(0,0,0,1) 0%)",
		to: "linear-gradient(to right, rgba(0,0,0,0) 100%, rgba(0,0,0,1) 120%)",
	},
};

export const swipeEnter = (element: RefObject<HTMLElement>, duration = 0.5) => {
	return gsap.fromTo(
		element.current,
		{maskImage: blurSwipe.enter.from},
		{maskImage: blurSwipe.enter.to, duration},
	);
};

export const swipeExit = (element: RefObject<HTMLElement>, duration = 0.5) => {
	return gsap.fromTo(
		element.current,
		{maskImage: blurSwipe.exit.from},
		{maskImage: blurSwipe.exit.to, duration},
	);
};
