import { createMuiTheme } from '@material-ui/core/styles';

export const DefaultTheme = createMuiTheme({
    palette: {
    },
    overrides: {
        MuiTypography: {
            h5: {
                fontSize: '36px',
            },
        },
    }
});