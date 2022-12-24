import {
	CSSProperties,
	FunctionComponent,
	useEffect,
	useRef,
	useState,
} from "react";
import {BoldText, ThinText, CreditText} from "./text";

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
			{!props.credit && props.thin && <ThinText>{props.children}</ThinText>}
			{!props.credit && !props.thin && <BoldText>{props.children}</BoldText>}
			{props.credit && <CreditText>{props.children}</CreditText>}
		</div>
	);
};
