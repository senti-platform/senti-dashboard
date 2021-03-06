import { makeStyles } from '@material-ui/core'
import { red, green, yellow, grey } from '@material-ui/core/colors'
import { primaryColor } from 'assets/jss/material-dashboard-react'

const devicetableStyles = makeStyles(theme => ({
	noCheckbox: {
		padding: 10
	},
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	},
	orgDevicesTD: {
		padding: '0 16px'
	},
	orgUsersTD: {
		[theme.breakpoints.down('md')]: {
			padding: '0 12px'
		},
		padding: '0 16px'
	},
	hideIcon: {
		display: "none",
		// position: 'absolute',
		// left: '90%'
	},
	centered: {
		textAlign: 'center'
	},
	deleteListItem: {
		padding: 0
	},
	tableCellNoWidth: {
		width: 0
	},
	noMargin: {
		whiteSpace: "pre-line",
		marginBottom: 0,
		overflow: 'hidden'
	},
	img: {
		borderRadius: "50px",
		height: "30px",
		width: "30px",
		display: 'flex'
	},
	tableCellID: {
		padding: "4px",
		minWidth: "30px",
		width: "30px"
	},
	redSignal: {
		color: red[700]
	},
	greenSignal: {
		color: green[700]
	},
	yellowSignal: {
		color: yellow[600]
	},
	headerCell: {
		color: "inherit",
	},
	paragraphCell: {
		margin: 0,
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis"
	},
	root: {
		width: '100%',
		margin: theme.spacing(1),
		borderRadius: "3px",
	},
	table: {
		minWidth: 0,
	},
	tableWrapper: {
		overflowX: 'auto',
	},
	header: {
		[theme.breakpoints.down('sm')]: {
			paddingRight: 4,
			padding: 0,
		},
		backgroundColor: grey[400],
		// color: grey[200]
	},
	checkbox: {
		color: grey[800],
		'&$checked': {
			color: primaryColor
		},
	},
	checked: {},
	headerButton: {
		width: "100%"
	},
	HeaderLabelActive: {
		width: "100%",
		color: grey[800],
		"&:hover": {
			color: "black"
		},
		"&:focus": {
			color: grey[900]
		}
	},
	tableCell: {
		/* 		padding: 4,
		fontSize: '0.875rem',
		// maxWidth: 250,
		width: 200,
		"&:last-child": {
			paddingRight: 4
		}, */
		borderTop: "1px solid rgba(224, 224, 224, 1)",

	},
	tablecellcheckbox: {
		[theme.breakpoints.down("sm")]: {
			width: '35px'
		},
		[theme.breakpoints.down("md")]: {
			width: '45px'
		},
		fontSize: '0.875rem',
		borderTop: "1px solid rgba(224, 224, 224, 1)",
		/*padding: 0, */
		width: '50px',
	},
	paddingLeft: {
		paddingLeft: 16
	}
}));

export default devicetableStyles