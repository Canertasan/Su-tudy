
import { deepOrange } from '@material-ui/core/colors';
const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    hide: {
        display: "none"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
    },
    appBarShow: {
        top: 'auto',
        bottom: 0,
        backgroundColor: "#FFFFFF"
    },
    appBarHide: {
        top: 'auto',
        bottom: 0,
        backgroundColor: "#FFFFFF",
        display: "none"
    },
    logo: {
        height: '50px',
        weight: '50px',
        marginTop: '10px'
    },
    showHide: {
        alignItems: 'center',
        justfityContent: 'center',
        display: 'flex',
    }
});
export default styles;