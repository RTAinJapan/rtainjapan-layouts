import Button, {ButtonProps} from "@mui/material/Button";
import createTheme from "@mui/material/styles/createTheme";
import {PaletteColorOptions} from "@mui/material/styles/createPalette";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {FC, PropsWithChildren} from "react";

type Props = PropsWithChildren<{
	color: PaletteColorOptions;
	ButtonProps?: ButtonProps;
}>;

export const ColoredButton: FC<Props> = (props) => (
	<ThemeProvider
		theme={(outer: any) =>
			createTheme({...outer, palette: {primary: props.color}})
		}
	>
		<Button
			{...props.ButtonProps}
			style={{...props.ButtonProps?.style, whiteSpace: "nowrap"}}
			color='primary'
		>
			{props.children}
		</Button>
	</ThemeProvider>
);
