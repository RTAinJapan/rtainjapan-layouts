import {CSSProperties, useEffect, useRef} from "react";
import * as PIXI from "pixi.js";

export const RoundedHoleImage: React.FunctionComponent<{
	src: string;
	width: number;
	height: number;
	roundedRect: {
		x: number;
		y: number;
		width: number;
		height: number;
		radius: number;
		border?: {
			color: string;
			width: number;
		};
	};
	style?: CSSProperties;
}> = ({src, roundedRect, width, height, style}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const app = new PIXI.Application({
			view: canvasRef.current,
			width: width,
			height: height,
		});

		const image = PIXI.Sprite.from(src);

		const cameraArea = new PIXI.Graphics();
		cameraArea.beginFill(0x000000);
		cameraArea.drawRoundedRect(
			roundedRect.x,
			roundedRect.y,
			roundedRect.width,
			roundedRect.height,
			roundedRect.radius,
		);
		cameraArea.endFill();
		cameraArea.lineStyle({width: 2, color: 0xffffff});
		cameraArea.blendMode = PIXI.BLEND_MODES.DST_OUT;

		app.stage.addChild(image, cameraArea);
	}, [
		height,
		width,
		src,
		roundedRect.x,
		roundedRect.y,
		roundedRect.width,
		roundedRect.height,
		roundedRect.radius,
	]);

	return (
		<div>
			<canvas style={style} ref={canvasRef}></canvas>
			{roundedRect.border && (
				<div
					style={{
						position: "absolute",
						left: `${roundedRect.x}px`,
						top: `${roundedRect.y}px`,
						width: `${roundedRect.width}px`,
						height: `${roundedRect.height}px`,
						borderRadius: `${roundedRect.radius}px`,
						border: `${roundedRect.border.width}px solid ${roundedRect.border.color}`,
					}}
				></div>
			)}
		</div>
	);
};
