import {
	red, pink, purple,
	deepPurple, indigo, blue,
	lightBlue, cyan, teal,
	green, lightGreen, lime, yellow, amber, orange, deepOrange
} from '@material-ui/core/colors'

export const getRandomColor = () => {
	let x = Math.floor(Math.random() * (colors.length - 0 + 1)) + 0;
	return colors[x]
}
const colors = [
	lightBlue[400],
	cyan[400],
	teal[400],
	green[400],
	lightGreen[400],
	lime[400],
	yellow[400],
	amber[400],
	orange[400],
	deepOrange[400],
	lightBlue[500],
	cyan[500],
	teal[500],
	green[500],
	lightGreen[500],
	lime[500],
	yellow[500],
	amber[500],
	orange[500],
	deepOrange[500],
	lightBlue[600],
	cyan[600],
	teal[600],
	green[600],
	lightGreen[600],
	lime[600],
	yellow[600],
	amber[600],
	orange[600],
	deepOrange[600],
	lightBlue[700],
	cyan[700],
	teal[700],
	green[700],
	lightGreen[700],
	lime[700],
	yellow[700],
	amber[700],
	orange[700],
	deepOrange[700],
	lightBlue[800],
	cyan[800],
	teal[800],
	green[800],
	lightGreen[800],
	lime[800],
	yellow[800],
	amber[800],
	orange[800],
	deepOrange[800],
	lightBlue[900],
	cyan[900],
	teal[900],
	green[900],
	lightGreen[900],
	lime[900],
	yellow[900],
	amber[900],
	orange[900],
	deepOrange[900],
	red[400],
	red[500],
	red[600],
	red[700],
	red[800],
	red[900],
	pink[400],
	pink[500],
	pink[600],
	pink[700],
	pink[800],
	pink[900],
	purple[400],
	purple[500],
	purple[600],
	purple[700],
	purple[800],
	purple[900],
	deepPurple[400],
	deepPurple[500],
	deepPurple[600],
	deepPurple[700],
	deepPurple[800],
	deepPurple[900],
	indigo[400],
	blue[400],
	indigo[500],
	blue[500],
	indigo[600],
	blue[600],
	indigo[700],
	blue[700],
	indigo[800],
	blue[800],
	indigo[900],
	blue[900],
]