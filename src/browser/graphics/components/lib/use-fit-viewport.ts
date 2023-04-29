import {RefObject, useEffect, useState} from "react";
import {useElementResize} from "./use-element-resize";

const useViewportSize = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const resizeHandler = () => {
			setHeight(window.innerHeight);
			setWidth(window.innerWidth);
		};
		window.addEventListener("resize", resizeHandler);
		return () => {
			return window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	return {height, width};
};

export const useFitViewport = <T extends HTMLElement>(ref: RefObject<T>) => {
	const windowSize = useViewportSize();

	const [refSize, setRefSize] = useState({height: 0, width: 0});
	useElementResize(ref, (size) => {
		setRefSize(size);
	});

	useEffect(() => {
		if (!ref.current) {
			return;
		}
		const {height, width} = refSize;
		const {height: windowHeight, width: windowWidth} = windowSize;
		const scale = Math.min(windowHeight / height, windowWidth / width);
		ref.current.style.transform = `scale(${scale})`;
		ref.current.style.transformOrigin = "top left";
	}, [refSize, windowSize, ref]);
};
