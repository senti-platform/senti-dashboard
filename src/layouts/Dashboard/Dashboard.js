import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withStyles, Snackbar, IconButton } from '@material-ui/core';
import { Header, Sidebar, CircularLoader } from 'components';

import dashboardRoutes from 'routes/dashboard.js';
import appStyle from 'assets/jss/material-dashboard-react/appStyle.js';
import { MuiThemeProvider } from '@material-ui/core/styles'
import logo from '../../logo.svg';
import cookie from 'react-cookies';
import withLocalization from 'components/Localization/T';
import { connect } from 'react-redux'
import { getSettings } from 'redux/settings';
import withSnackbarHandler from 'components/Localization/SnackbarHandler';
import {  Close } from 'variables/icons';
import { lightTheme, darkTheme } from 'variables/themes'
import { getDaysOfInterest } from 'redux/doi';
import Cookies from 'components/Cookies/Cookies';

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mobileOpen: false,
			headerTitle: '',
			goBackButton: false,
			url: '',
			menuRoute: 0,
		}
	}

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	handleSetHeaderTitle = (headerTitle, goBackButton, url, menuRoute) => {
		if (this._isMounted) {
			if (headerTitle !== this.state.headerTitle) {
				if (typeof headerTitle === 'string') {
					if (headerTitle !== this.state.headerTitle.id) {
						this.setState({
							headerTitle: {
								id: headerTitle,
								options: null
							},
							goBackButton: goBackButton,
							url,
							menuRoute
						})
					}
				}
				else {
					this.setState({
						headerTitle: headerTitle,
						goBackButton: goBackButton,
						url,
						menuRoute
					})
				}
			}
		}
	};
	handleGoBackButton = () => {
		this.props.history.push(this.state.url)
		this.setState({ url: '' })
	}
	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			this.handleSetHeaderTitle('Senti.Cloud', false, '', 'dashboard')
		}
		
		await this.props.getSettings().then(async rs => {
			await this.props.getDaysOfIterest()
			if (this.props.theme === 1) {
				document.body.style = 'background: #2e2e2e;';
			}
			else {
				document.body.style = 'background: #eee';
			}
			/* if (navigator.platform.indexOf('Win') > -1) {
				if (!this.props.loading) {
					if (this.refs.mainPanel) {
						eslint-disable-next-line
						const ps = new PerfectScrollbar(this.refs.mainPanel);
					}
				}
			} */
		})
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.headerTitle.id !== this.state.headerTitle.id && this.refs.mainPanel)
			this.refs.mainPanel.scrollTop = 0
		if (prevProps.sId !== this.props.sId && this.props.sId !== '')
			this.setState({ openSnackbar: true })
		if (this.props.theme !== prevProps.theme) {
			if (this.props.theme === 1) {
				document.body.style = 'background: #2e2e2e;';
			}
			else {
				document.body.style = 'background: #eee';
			}
		}
	}
	
	render() {
		const { classes, t, loading, sOpt, defaultRoute, snackbarLocation, defaultView, ...rest } = this.props;
		return (
			<MuiThemeProvider theme={this.props.theme === 0 ? lightTheme : darkTheme }>

				<div className={classes.wrapper + ' ' + (this.props.theme === 0 ? '' : classes.darkBackground) }>
					<div className={classes.mainPanel} ref={'mainPanel'}>
						<Header
							routes={dashboardRoutes}
							handleDrawerToggle={this.handleDrawerToggle}
							goBackButton={this.state.goBackButton}
							gbbFunc={this.handleGoBackButton}
							headerTitle={this.state.headerTitle}
							t={t}
							{...rest}
						/>
						<Fragment>
							<Sidebar
								defaultView={defaultView}
								defaultRoute={defaultRoute}
								routes={dashboardRoutes}
								logo={logo}
								handleDrawerToggle={this.handleDrawerToggle}
								open={this.state.mobileOpen}
								color='senti'
								t={t}
								menuRoute={this.state.menuRoute}
								{...rest}
							/>
							{!loading ? <Fragment>
								<div className={classes.container} id={'container'}>
									<Switch>
										{cookie.load('SESSION') ?
											dashboardRoutes.map((prop, key) => {
												if (prop.redirect) {
													return <Redirect from={prop.path} to={prop.to} key={key} />;
												}
												return <Route path={prop.path} render={(routeProps) => <prop.component {...routeProps} setHeader={this.handleSetHeaderTitle} />} key={key} />;
											})
											: <Redirect from={window.location.pathname} to={{
												pathname: '/login', state: {
													prevURL: window.location.pathname
												}
											}} />}
									</Switch>
								</div>
								<Cookies/>
								<Snackbar
									anchorOrigin={{ vertical: 'bottom', horizontal: snackbarLocation }}
									open={this.props.sOpen}
									onClose={this.props.sClose}
									onExited={this.props.handleNextS}
									ContentProps={{
										'aria-describedby': 'message-id',
									}}
									ClickAwayListenerProps={{
										mouseEvent: false,
										touchEvent: false
									}}
									autoHideDuration={3000}
									message={<span>{t(this.props.sId, this.props.sOpt)}</span>}
									action={
										<IconButton color={'primary'} size={'small'} onClick={this.props.sClose} >
											<Close />
										</IconButton>
									}
								/>
							
							</Fragment> : <CircularLoader />}
						</Fragment>
					</div>
				
				</div >
			</MuiThemeProvider>

		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
	loading: state.settings.loading,
	theme: state.settings.theme,
	// cookies: state.settings.cookies,
	defaultRoute: state.settings.defaultRoute,
	defaultView: state.settings.defaultView,
	snackbarLocation: state.settings.snackbarLocation
})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings()),
	getDaysOfIterest: async () => dispatch(await getDaysOfInterest()),
	// acceptCookies: async (val) => dispatch(await acceptCookiesFunc(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbarHandler()((withLocalization()(withStyles(appStyle)(App)))))
