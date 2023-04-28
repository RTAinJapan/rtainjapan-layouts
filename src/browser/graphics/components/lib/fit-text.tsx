import {
	CSSProperties,
	FunctionComponent,
	useEffect,
	useRef,
	useState,
} from "react";
import {BoldText, ThinText, CreditText} from "./text";
import {newlineString} from "./util";

export const FitText: FunctionComponent<{
	defaultSize: number;
	children: string | undefined | null;
	thin?: boolean;
	credit?: boolean;
	style?: CSSProperties;
}> = (props) => {
	const [size, setSize] = useState(props.defaultSize);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setSize(props.defaultSize);

		const fixSize = (max: number | undefined, current: number | undefined) => {
			if (max && current && max < current) {
				setSize((size) => size * (max / current));
			}
		};

		const fit = () => {
			const maxWidth = ref?.current?.clientWidth;
			const currentWidth = ref?.current?.scrollWidth;
			fixSize(maxWidth, currentWidth);

			const maxHeight = ref?.current?.clientHeight;
			const currentHeight = ref?.current?.scrollHeight;
			fixSize(maxHeight, currentHeight);
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
				height: "100%",
				overflow: "hidden",
				fontSize: `${size}px`,
				display: "grid",
				placeItems: "center",
				textAlign: "center",
				...props.style,
			}}
		>
			{!props.credit && props.thin && (
				<ThinText>{newlineString(props.children)}</ThinText>
			)}
			{!props.credit && !props.thin && (
				<BoldText>{newlineString(props.children)}</BoldText>
			)}
			{props.credit && <CreditText>{newlineString(props.children)}</CreditText>}
		</div>
	);
};
