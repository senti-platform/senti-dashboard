
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
// import Collection from 'views/Collections/Collection';
import EditRegistry from 'views/Registries/EditRegistry';
import Registry from 'views/Registries/Registry';

const registry = (props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <EditRegistry {...props} />}/>
			<Route path={`${props.match.url}`} render={() => <Registry {...props} />} /> 
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(registry)