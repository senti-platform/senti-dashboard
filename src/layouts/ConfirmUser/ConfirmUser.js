import React, { useState, useEffect, useCallback } from 'react'
import { Collapse, Button, Paper, Hidden } from '@material-ui/core'
import { Danger, ItemG, /* Success, */ Muted, T, CircularLoader } from 'components'
import loginPageStyles from 'assets/jss/components/login/loginPageStyles'
import { getNSettings } from 'redux/settings'
import TextF from 'components/CustomInput/TextF'
import { changeLanguage } from 'redux/localization'
import cookie from 'react-cookies'
import { setToken } from 'variables/data'
import LoginImages from 'layouts/Login/LoginImages'
import { Link, useParams, useHistory } from 'react-router-dom'
import logo from 'logo.svg'
import { confirmUser as confirmSUser } from 'variables/dataUsers'
import { useLocalization, useDispatch, useEventListener, useTheme } from 'hooks'
import { getWL } from 'variables/storage'
import { ImgLogo } from 'styles/loginStyles'

// const mapDispatchToProps = dispatch => ({
// 	getSettings: async () => dispatch(await getSettings()),
// 	changeLanguage: l => dispatch(changeLanguage(l, true))
// })

const ConfirmUser = (props) => {
	//Hooks
	const params = useParams()
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = loginPageStyles()
	const history = useHistory()
	const theme = useTheme()
	//Redux

	//State
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loggingIn, setLoggingIn] = useState(false)
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState([])
	const wl = getWL()


	useEffect(() => {
		let lang = params.lang
		if (lang) {
			dispatch(changeLanguage(lang, true))
		}
		return () => {

		}
		//eslint-disable-next-line
	}, [])

	const handleValidation = useCallback(() => {
		let errorCode = []
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
			setError(true)
			setErrorMessage(error.code.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))
			return false
		}
	}, [confirmPassword, error.code, password])

	const errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 0:
				return t('confirmUser.validation.passwordEmpty')
			case 1:
				return t('confirmUser.validation.passwordUnder8')
			case 2:
				return t('confirmUser.validation.passwordMismatch')
			case 404:
				return t('confirmUser.validation.userDoesntExistAnymore')
			default:
				return ''
		}
	}
	const loginUser = useCallback(async (session) => {
		setLoggingIn(true)
		setTimeout(
			async () => {

				cookie.save('SESSION', session, { path: '/' })
				if (session.isLoggedIn) {
					if (setToken()) {
						await dispatch(await getNSettings())
						history.push('/dashboard')
					}
				}

				else {
					setError(true)
					setErrorMessage([<Danger >{t('confirmUser.networkError')}</Danger>])
					setLoggingIn(false)
					// this.setState({
					// 	error: true,
					// 	errorMessage: ,
					// 	loggingIn: false
					// })
				}
			}, 1000)
	}, [dispatch, history, t])

	const confirmUser = useCallback(async () => {
		if (handleValidation()) {
			let session = await confirmSUser({ newPassword: password, passwordToken: params.token })
			if (session !== 404 && session)
				loginUser(session)
			else {
				setError(true)
				setErrorMessage([<Danger >{errorMessages(session)}</Danger>])
			}
		}
	}, [handleValidation, loginUser, params.token, password])
	const handleKeyPress = useCallback((event) => {
		if (event.key === 'Enter') {
			confirmUser()
		}
	}, [confirmUser])
	useEventListener('keypress', handleKeyPress)

	const handlePasswordChange = e => {
		setPassword(e.target.value)
		if (error) {
			setError(false)
			setErrorMessage([])
		}
	}
	const handleConfirmPasswordChange = e => {
		setConfirmPassword(e.target.value)
		if (error) {
			setError(false)
			setErrorMessage([])
		}
	}

	// const handleChange = prop => e => {

	// 	this.setState({
	// 		...this.state,
	// 		[prop]: e.target.value
	// 	})
	// 	if (this.state.error)
	// 		this.setState({
	// 			error: false,
	// 			errorMessage: []
	// 		})
	// }
	return (
		<div className={classes.wrapper}>
			<ItemG xs={12} sm={12} md={4} lg={4} xl={3} container>
				<div className={classes.mobileContainer}>

					<Paper className={classes.paper}>
						<div className={classes.paperContainer}>

							<ItemG xs={12} container justify={'center'}>
								<ImgLogo src={theme.logo ? theme.logo : logo} alt={'sentiLogo'} />
							</ItemG>
							<ItemG xs={12} container justify={'center'}>
								{/* <T className={classes.loginButton + ' ' + classes.needAccount}>{t('confirmUser.welcomeMessage')}</T> */}
								<T className={classes.loginButton + ' ' + classes.needAccount}>{t('confirmUser.lastStep')}</T>
							</ItemG>
							<ItemG xs={12} container justify={'center'}>
								<ItemG container justify={'center'} xs={12}>
									<Collapse in={loggingIn}>
										<CircularLoader />
									</Collapse>
									<Collapse in={error}>
										{errorMessage.map(m => m)}
									</Collapse>
								</ItemG>

								<ItemG container xs={12}>

									<ItemG container xs={12}>
										<TextF
											fullWidth
											id={'password'}
											label={t('confirmUser.password')}
											value={password}
											className={classes.loginButton}
											onChange={handlePasswordChange}
											margin='normal'
											error={error}
											type={'password'}
										/>
									</ItemG>
									<ItemG container xs={12}>
										<TextF
											fullWidth
											id={'confirmpassword'}
											label={t('confirmUser.passwordConfirm')}
											value={confirmPassword}
											className={classes.loginButton}
											onChange={handleConfirmPasswordChange}
											margin='normal'
											error={error}
											type={'password'}
										/>
									</ItemG>
									{/* <Collapse in={passwordRequest}>
										<ItemG xs={12} className={classes.loginButton}>
											<Success>{t('dialogs.login.resetPassRequestMessage')}</Success>
										</ItemG>
									</Collapse> */}
								</ItemG>
								<ItemG xs={12} container justify={'center'}>
									<Button variant={'outlined'} color={'primary'} size='large' className={classes.loginButton} onClick={confirmUser}>
										{t('confirmUser.button')}
									</Button>
								</ItemG>
								<ItemG xs={12} container justify={'center'} style={{ margin: "32px 0px" }}>
									<ItemG xs={12} container justify={'space-around'}>
										<Link to={`/login`}>
											{t('actions.goToLogin')}
										</Link>
									</ItemG>
								</ItemG>
							</ItemG>
						</div>
						<ItemG xs={12} container alignItems={'flex-end'} justify={'center'} className={classes.footer}>
							<Muted className={classes.footerText}>
								{wl ? wl.loginSettings.copyrighttext ? wl.loginSettings.copyrighttext : `${t('login.footer')} ` : `${t('login.footer')} `}
							</Muted>
						</ItemG>
					</Paper>
				</div>
			</ItemG>
			<Hidden smDown>
				<ItemG md={8} lg={8} xl={9}>
					<LoginImages t={t} />
				</ItemG>
			</Hidden>
		</div>
	)
}


export default ConfirmUser
