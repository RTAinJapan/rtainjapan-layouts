import {CSSProperties, useEffect, useRef} from "react";

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
	};
	style?: CSSProperties;
}> = ({src, roundedRect, width, height, style}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		const drawRoundedRect = () => {
			const {x, y, width, height, radius} = roundedRect;
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(
				x + width,
				y + height,
				x + width - radius,
				y + height,
			);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
		};

		const image = new Image(width, height);

		const loadHanlder = () => {
			canvas.width = image.width;
			canvas.height = image.height;
			ctx.drawImage(image, 0, 0);

			ctx.save();
			drawRoundedRect();
			ctx.clip();
			ctx.clearRect(
				roundedRect.x,
				roundedRect.y,
				roundedRect.width,
				roundedRect.height,
			);
			ctx.restore();
		};

		image.addEventListener("load", loadHanlder);
		image.src = src;

		return () => {
			image.removeEventListener("load", loadHanlder);
			image.remove();
		};
	}, [src, roundedRect, width, height]);

	return <canvas ref={canvasRef} style={style} />;
};
