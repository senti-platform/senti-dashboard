import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core';
import withLocalization from 'components/Localization/T';

const ITB = (props) => {
	return (
		<Tooltip title={props.t(props.label)} classes={props.tooltipClasses}>
			<IconButton className={props.buttonClass} onClick={props.onClick}>
				{props.icon}
			</IconButton>
		</Tooltip>
	)
}

export default withLocalization()(ITB)
