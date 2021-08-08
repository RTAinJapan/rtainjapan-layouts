import Button, {ButtonProps} from "@material-ui/core/Button";
import createTheme from "@material-ui/core/styles/createTheme";
import {PaletteColorOptions} from "@material-ui/core/styles/createPalette";
import {MuiThemeProvider} from "@material-ui/core/styles";
import React from "react";

interface Props {
	color: PaletteColorOptions;
	ButtonProps?: ButtonProps;
}

export const ColoredButton: React.ComponentType<Props> = (props) => (
	<MuiThemeProvider
		theme={(outer: any) =>
			createTheme({...outer, palette: {primary: props.color}})
		}
	>
		<Button
			{...props.ButtonProps}
			style={{whiteSpace: "nowrap"}}
			color='primary'
		>
			{props.children}
		</Button>
	</MuiThemeProvider>
);
