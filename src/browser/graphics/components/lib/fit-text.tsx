import {
	CSSProperties,
	FunctionComponent,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

export const FitText: FunctionComponent<{
	defaultSize: number;
	children: ReactNode;
	style?: CSSProperties;
}> = (props) => {
	const [size, setSize] = useState(props.defaultSize);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setSize(props.defaultSize);
		const fit = () => {
			const maxWidth = ref?.current?.clientWidth;
			const currentWidth = ref?.current?.scrollWidth;
			if (maxWidth && currentWidth && maxWidth < currentWidth) {
				setSize((size) => size * (maxWidth / currentWidth));
			}
		};
		const interval = setInterval(fit, 100);
		fit();
		return () => {
			clearInterval(interval);
		};
	}, [props.defaultSize, props.children]);

	return (
		<div
			ref={ref}
			style={{
				width: "100%",
				overflow: "hidden",
				fontSize: `${size}px`,
				display: "grid",
				placeItems: "center",
				...props.style,
			}}
		>
			{props.children}
		</div>
	);
};
