import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoCard, ItemGrid, DSelect, CircularLoader } from 'components';
import { Laptop } from 'variables/icons'
import { Grid, ListItem, List, ListItemText, withStyles } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';

class DisplaySettings extends Component {

	static propTypes = {
		language: PropTypes.string.isRequired
	}
	
	changeLang = (e) => this.props.changeLanguage(e.target.value)
	changeTRP = (e) => this.props.changeTRP(e.target.value)
	changeTheme = (e) => this.props.changeTheme(e.target.value)
	changeSideBarLoc = (e) => this.props.changeSideBarLoc(e.target.value)
	changeDiscoverSenti = e => this.props.changeDiscoverSenti(e.target.value)
	changeMapTheme = e => this.props.changeMapTheme(e.target.value)
	changeDefaultRoute = e => this.props.changeDefaultRoute(e.target.value)
	
	render() {
		const { language, trp, sideBar, discSentiVal, theme, mapTheme, classes, t, defaultRoute } = this.props
		let defaultRoutes = [
			{ value: '/favorites', label: t('sidebar.favorites') },
			{ value: '/dashboard', label: t('sidebar.dashboard') },
			{ value: '/projects', label: t('sidebar.projects') },
			{ value: '/devices', label: t('sidebar.devices') },
			{ value: '/collections', label: t('sidebar.collections') }
		]
		let discSenti = [
			{ value: 1, label: t('actions.yes') },
			{ value: 0, label: t('actions.no') }
		]
		let languages = [
			{ value: 'en', label: t('settings.languages.en') },
			{ value: 'da', label: t('settings.languages.da') }
		]

		let mapThemes = [
			{ value: 0, label: this.props.t("map.themes.0") },
			{ value: 1, label: this.props.t("map.themes.1") },
			{ value: 2, label: this.props.t("map.themes.2") },
			{ value: 3, label: this.props.t("map.themes.3") },
			{ value: 4, label: this.props.t("map.themes.4") },
			{ value: 5, label: this.props.t("map.themes.5") },
			{ value: 6, label: this.props.t("map.themes.6") },
			{ value: 7, label: this.props.t("map.themes.7") }
		]

		let themes = [
			{ value: 1, label: t('settings.themes.dark') },
			{ value: 0, label: t('settings.themes.light') }
		]
		let trps = [
			{ value: 5, label: 5 },
			{ value: 7, label: 7 },
			{ value: 8, label: 8 },
			{ value: 10, label: 10 },
			{ value: 15, label: 15 },
			{ value: 20, label: 20 },
			{ value: 25, label: 25 },
			{ value: 50, label: 50 },
			{ value: 100, label: 100 }
		]

		let sideBarLocs = [
			{ value: 0, label: t('settings.sideBarLeft') },
			{ value: 1, label: t('settings.sideBarRight') }
		]

		return (
			discSentiVal !== null && language !== null && trp !== null && sideBar !== null && theme !== null ? 
				<InfoCard
					noExpand
					avatar={<Laptop />}
					title={t('settings.headers.display')}
					content={
						<Grid container>
							<List className={classes.list}>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.discoverSenti')}</ListItemText>
										<DSelect menuItems={discSenti} value={discSentiVal} onChange={this.changeDiscoverSenti} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.defaultRoute')}</ListItemText>
										<DSelect menuItems={defaultRoutes} value={defaultRoute} onChange={this.changeDefaultRoute} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.language')}</ListItemText>
										<DSelect menuItems={languages} value={language} onChange={this.changeLang} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.trp')}</ListItemText>
										<DSelect menuItems={trps} value={trp} onChange={this.changeTRP} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.sideBarLoc')}</ListItemText>
										<DSelect menuItems={sideBarLocs} value={sideBar} onChange={this.changeSideBarLoc} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.theme')}</ListItemText>
										<DSelect menuItems={themes} value={theme} onChange={this.changeTheme} />
									</ItemGrid>
								</ListItem>
								<ListItem>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.map')}</ListItemText>
										<DSelect menuItems={mapThemes} value={mapTheme} onChange={this.changeMapTheme} />
									</ItemGrid>
								</ListItem>
							</List>
						</Grid>
					}
				/> : <CircularLoader notCentered/>
		)
	}
}
export default withStyles(settingsStyles)(DisplaySettings)