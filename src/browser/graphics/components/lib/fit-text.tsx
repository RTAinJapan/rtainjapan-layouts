import {
	CSSProperties,
	FunctionComponent,
	useCallback,
	useRef,
	useState,
} from "react";
import {useElementResize} from "./use-element-resize";
import {BoldText, ThinText, CreditText} from "./text";
import {newlineString} from "./util";

export const FitText: FunctionComponent<{
	defaultSize: number;
	children: string | undefined | null;
	thin?: boolean;
	credit?: boolean;
	style?: CSSProperties;
	align?: "left" | "right";
}> = (props) => {
	const [fontSize, setFontSize] = useState(props.defaultSize);

	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	const getRatio = useCallback((dimention: "width" | "height") => {
		const capDimation = dimention === "height" ? "Height" : "Width";
		const max = containerRef.current?.[`client${capDimation}`];
		const current = textRef.current?.[`scroll${capDimation}`];
		if (max && current) {
			return max / current;
		} else {
			return Infinity;
		}
	}, []);

	const resizeCallback = useCallback(() => {
		if (!containerRef.current || !textRef.current) {
			return;
		}
		const ratio = Math.min(getRatio("width"), getRatio("height"));
		setFontSize((size) =>
			Math.min(Math.floor(size * ratio), props.defaultSize),
		);
	}, [getRatio, props.defaultSize]);

	useElementResize(containerRef, resizeCallback);
	useElementResize(textRef, resizeCallback);

	const TextComponent = props.credit
		? CreditText
		: props.thin
		? ThinText
		: BoldText;

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				overflow: "hidden",
				fontSize: `${fontSize}px`,
				display: "grid",
				...props.style,
			}}
		>
			<div
				ref={containerRef}
				style={{
					overflow: "hidden",
					display: "grid",
					alignItems: "center",
					justifyItems:
						props.align === "left"
							? "start"
							: props.align === "right"
							? "end"
							: "center",
					textAlign: props.align ?? "center",
				}}
			>
				<TextComponent ref={textRef}>
					{newlineString(props.children)}
				</TextComponent>
			</div>
		</div>
	);
};
