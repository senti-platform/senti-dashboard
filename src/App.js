import React, { Component } from 'react'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import indexRoutes from 'routes/index.js'
import 'assets/css/material-dashboard-react.css?v=1.2.0'
import 'assets/css/leaflet.css'

import TProvider from 'components/Localization/TProvider'

import 'core-js/fn/set';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';
import { MuiThemeProvider } from '@material-ui/core';
import { lightTheme } from 'variables/themes';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

var countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))
countries.registerLocale(require('i18n-iso-countries/langs/da.json'))

export const hist = createBrowserHistory();


class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<TProvider>
						<MuiThemeProvider theme={lightTheme}>
							<Router history={hist}>
								<Switch>
									{indexRoutes.map((prop, key) => {
										return <Route path={prop.path} component={prop.component} key={key} exact={prop.exact ? true : false} />;
									})}
								</Switch>
							</Router>
						</MuiThemeProvider>
					</TProvider>
				</MuiPickersUtilsProvider>
			</Provider>
		)
	}
}


export default App