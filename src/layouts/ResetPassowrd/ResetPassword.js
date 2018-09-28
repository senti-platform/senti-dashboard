import React, { Fragment } from "react";
// material-ui components
import {/*  InputAdornment, */ withStyles, CardContent, Collapse, Button, Grid } from "@material-ui/core";
// @material-ui/icons
// import { LockOutlined, Person } from "@material-ui/icons";
// core components
import { GridContainer, ItemGrid, Info, /* Warning,  */Danger, ItemG, Success } from "components";
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
// import CustomInput from "components/CustomInput/CustomInput.js";

import loginPageStyle from "assets/jss/material-dashboard-react/loginPageStyle.js";
// import { loginUser } from "variables/dataLogin";
// import { setToken } from 'variables/data'
// import cookie from "react-cookies";
// import classNames from 'classnames';
import CircularLoader from "components/Loader/CircularLoader";
import withLocalization from "components/Localization/T";
import { connect } from 'react-redux';
import { getSettings } from 'redux/settings';
import TextF from '../../components/CustomInput/TextF';
import { changeLanguage } from 'redux/localization';
import cookie from 'react-cookies';
import { setToken } from 'variables/data';
import { resetPassword, confirmPassword } from '../../variables/dataLogin';
var passChecker = require("zxcvbn")

class ResetPassword extends React.Component {
	constructor(props) {
		super(props);
		// we use this to make the card to appear after the page has been rendered
		this.state = {
			cardAnimaton: "cardHidden",
			email: '',
			password: '',
			confirmPassword: '',
			loggingIn: false,
			error: false,
			errorMessage: [],
			score: 0,
			minScore: 2,
			minLength: 8,
			passwordRequested: false
		};
		this.input = React.createRef()
	}
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.confirmPass()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keypress', this.handleKeyPress, false)
	}

	componentDidMount() {
		this._isMounted = 1
		window.addEventListener('keypress', this.handleKeyPress, false)
		let lang = this.props.match.params.lang
		this.token = this.props.match.params.token
		if (lang) {
			this.props.changeLanguage(lang)
		}
		setTimeout(
			function () {
				return this._isMounted ? this.setState({ cardAnimaton: "" }) : '';
			}.bind(this),
			300
		);
	}

	createRef = (ref) => {
		this.input = ref
		return this.input
	}
	handleValidation = () => {
		let errorCode = [];
		const { password, confirmPassword } = this.state
		if (password === '' && confirmPassword === '') {
			errorCode.push(0)
		}
		if (password.length < 8) {
			errorCode.push(1)
		}
		if (password !== confirmPassword) {
			errorCode.push(2)
		}
		if (errorCode.length === 0) {
		
			return true
		}
		else {
			console.log("hit")
			this.setState({
				error: true,
				errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
			})	
			return false
		}
	}
	errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 0:
				return t("confirmUser.validation.passwordEmpty")
			case 1:
				return t("confirmUser.validation.passwordUnder8")
			case 2:
				return t("confirmUser.validation.passwordMismatch")
			default:
				return ""
		}
	}
	confirmPass = async () => {
		if (this.handleValidation()) {
			const { password } = this.state
			const { t } = this.props
			let session = await confirmPassword({ newPassword: password, passwordToken: this.token })
			if (session)
				this.loginUser(session)
			else {
				this.setState({
					error: true,
					errorMessage: [<Danger>{t("confirmUser.networkError")}</Danger>]
				})
			}
		}
	}
	resetPass = async () => {
		const { email } = this.state
		let session = await resetPassword({ email: email })
		if (session) {
			this.setState({
				passwordRequested: true
			})
		}
	}
	loginUser = async (session) => {
		const { t } = this.props
		this.setState({ loggingIn: true })
		setTimeout(
			async () => {

				cookie.save('SESSION', session, { path: '/' })
				if (session.isLoggedIn) {
					if (setToken()) {
						await this.props.getSettings()
						this.props.history.push("/dashboard")
					}
				}

				else {
					this.setState({
						error: true,
						errorMessage: t("confirmUser.networkError"),
						loggingIn: false
					})
				}
			}, 1000)
	}


	handleChange = prop => e => {
		let score = 0
		let result = null
		let pass = e.target.value
		if (!(pass.length < this.state.minLength)) {
			result = passChecker(pass, [])
			score = result.score
		}
		this.setState({
			...this.state,
			isValid: score >= this.state.minScore,
			score,
			[prop]: e.target.value
		})
		if (this.state.error)
			this.setState({
				error: false,
				errorMessage: []
			})
	}
	render() {
		const { classes, t } = this.props;
		const { error, email, errorMessage, password, confirmPassword, passwordRequested } = this.state
		return (
			<div>
				<div
					className={classes.pageHeader}
					style={{
						backgroundColor: "#1a1b32",
						backgroundSize: "cover",
						backgroundPosition: "top center"
					}}
				>
					<div className={classes.container}>
						<GridContainer justify="center">
							<ItemGrid xs={12} sm={6} md={4}>
								<Card className={classes[this.state.cardAnimaton]}>
									<form className={classes.form}>
										<CardHeader color="primary" className={classes.cardHeader}>
											<h4>Senti.Cloud</h4>
										</CardHeader>
										<CardBody>
											<Grid container>
												<ItemG xs={12}>
													<Collapse in={passwordRequested}>
														<Success>{t("login.resetPassRequestMessage")}</Success>
													</Collapse>
													<Collapse in={!error}>
														{this.token ? null : <Info>{t("login.resetPasswordMessage")}</Info>}
													</Collapse>
													<Collapse in={error}>
														{errorMessage.map(m => m)}
													</Collapse>
												</ItemG>
												<ItemG xs={12}>
													{this.token ? null : <TextF
														id={"email"}
														autoFocus
														label={t('users.fields.email')}
														value={email}
														className={classes.textField}
														// disabled={true}
														handleChange={this.handleChange("email")}
														margin="normal"
														noFullWidth
														error={error}
													/>}
												</ItemG>

												{this.token ? <Fragment>
													<ItemG xs={12}>
														<TextF
															id={"password"}
															label={t('confirmUser.password')}
															value={password}
															className={classes.textField}
															// disabled={true}
															handleChange={this.handleChange("password")}
															margin="normal"
															noFullWidth
															error={error}
															type={'password'}
														// helperText={<Danger>{this.state.score}</Danger>}
														/>
													</ItemG>
													<ItemG xs={12}>
														<TextF
															id={"confirmpassword"}
															label={t("confirmUser.passwordConfirm")}
															value={confirmPassword}
															className={classes.textField}
															// disabled={true}
															handleChange={this.handleChange("confirmPassword")}
															margin="normal"
															noFullWidth
															error={error}
															type={'password'}
														/>
													</ItemG>
												</Fragment> : null}
											</Grid>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											{!this.token ? <Button variant={'contained'} color={'primary'} onClick={this.resetPass}>
												{t("login.requestPasswordReset")}
											</Button> :
												<Button variant={'contained'} color={'primary'} onClick={this.confirmPass}>
													{t("login.changePassword")}
												</Button>}
										</CardFooter>
									</form>
									<Collapse in={this.state.loggingIn} timeout="auto" unmountOnExit>
										<CardContent>
											<CircularLoader notCentered />
										</CardContent>
									</Collapse>
								</Card>
							</ItemGrid>
						</GridContainer>
					</div>
				</div>

			</div>
		);
	}
}
const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings()),
	changeLanguage: l => dispatch(changeLanguage(l, true))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(loginPageStyle)(ResetPassword)));