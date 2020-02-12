import {createMuiTheme} from '@material-ui/core/styles';
import palette from './palette';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: palette
});

export default theme;
