import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Button, { ButtonProps } from '../../../../node_modules/@material-ui/core/Button';
import { PaletteColorOptions } from '../../../../node_modules/@material-ui/core/styles/createPalette';

interface Props {
	color: PaletteColorOptions;
	ButtonProps?: ButtonProps;
}

export const ColoredButton: React.ComponentType<Props> = props => (
	<MuiThemeProvider
		theme={outer =>
			createMuiTheme({...outer, palette: {primary: props.color}})
		}
	>
		<Button {...props.ButtonProps} color='primary'>{props.children}</Button>
	</MuiThemeProvider>
);
