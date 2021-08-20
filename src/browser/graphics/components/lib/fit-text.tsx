import {
	CSSProperties,
	FunctionComponent,
	useEffect,
	useRef,
	useState,
} from "react";
import {BoldText, ThinText} from "./text";

export const FitText: FunctionComponent<{
	defaultSize: number;
	children: string | undefined | null;
	thin?: boolean;
	style?: CSSProperties;
}> = (props) => {
	const [size, setSize] = useState(props.defaultSize);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setSize(props.defaultSize);
		const interval = setInterval(() => {
			const maxWidth = ref?.current?.clientWidth;
			const currentWidth = ref?.current?.scrollWidth;
			if (maxWidth && currentWidth && maxWidth < currentWidth) {
				setSize((size) => size * (maxWidth / currentWidth));
			}
		}, 1000);
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
			{props.thin ? (
				<ThinText>{props.children}</ThinText>
			) : (
				<BoldText>{props.children}</BoldText>
			)}
		</div>
	);
};
