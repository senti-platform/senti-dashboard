import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";

import typographyStyle from "assets/jss/material-dashboard-react/typographyStyle.js";

function Small({ ...props }) {
	const { classes, children } = props;
	return (
		<div className={classes.defaultFontStyle + " " + classes.smallText}>
			{children}
		</div>
	);
}

Small.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(typographyStyle)(Small);
