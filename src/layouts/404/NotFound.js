import React, { Component } from 'react'

import { Typography } from '@material-ui/core';

class NotFound extends Component {
	componentDidMount = () => {
	  this.props.setHeader("", true)
	}
	
	render() {
		return (

			<Typography variant={'display2'}>
							404
			</Typography>

		)
	}
}

export default NotFound