import React, { Component } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import { userStyles } from 'assets/jss/components/users/userStyles';
import { withStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Fade } from '@material-ui/core';
import { getOrg, getOrgUsers } from 'variables/dataOrgs';
import OrgDetails from './OrgCards/OrgDetails';
import { connect } from 'react-redux'
import { deleteOrg } from 'variables/dataOrgs';
import OrgUsers from 'views/Orgs/OrgCards/OrgUsers';
import OrgDevices from 'views/Orgs/OrgCards/OrgDevices';
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites';
import { getAllDevices } from 'variables/dataDevices';
// import Toolbar from 'components/Toolbar/Toolbar';
import { Business, DeviceHub, People, LibraryBooks, DataUsage } from 'variables/icons';
import { getAllProjects } from 'variables/dataProjects';
import { getAllCollections } from 'variables/dataCollections';
import OrgProjects from './OrgCards/OrgProjects';
import OrgCollections from './OrgCards/OrgCollections';

class Org extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			users: [],
			loading: true,
			loadingUsers: true,
			openDelete: false
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.componentDidMount()
		}
		if (this.props.saved === true) {
			const { org } = this.state
			if (this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.saved', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.removed', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
			}
		}
	}

	componentDidMount = async () => {
		const { match, setHeader, location, history, setBC, setTabs } = this.props
		if (match)
			if (match.params.id) {
				await getOrg(match.params.id).then(async rs => {
					if (rs === null)
						history.push({
							pathname: '/404',
							prevURL: window.location.pathname
						})
					else {
						let prevURL = location.prevURL ? location.prevURL : '/management/orgs'
						console.log(prevURL)
						setHeader('orgs.organisation', true, prevURL, 'users')
						setTabs({
							id: 'org',
							tabs: this.tabs,
							route: 0
						})
						this.setState({ org: rs, loading: false })
					}
				})
				setBC('org', this.state.org.name)
				await getOrgUsers(this.props.match.params.id).then(rs => {
					this.setState({ users: rs, loadingUsers: false })
				})
				await getAllDevices().then(rs => { 
					let devices = rs.filter(f => f.org.id === this.state.org.id)
					this.setState({ devices: devices, loadingDevices: false })
				})
				await getAllCollections().then(rs => {
					let collections = rs.filter(f => f.org.id === this.state.org.id)
					this.setState({ collections: collections, loadingCollections: false })
				})
				await getAllProjects().then(rs => {
					let projects = rs.filter(f => f.org.id === this.state.org.id)
					this.setState({ projects: projects, loadingProjects: false })
				})
			}
	}
	addToFav = () => {
		const { org } = this.state
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { org } = this.state
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}
	close = () => {
		this.snackBarMessages(1)
		this.props.history.push('/management/orgs')
	}
	handleDeleteOrg = async () => {
		await deleteOrg(this.state.org.id).then(rs => {
			this.setState({
				openDelete: false
			})
			this.close()
		})
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}


	renderDeleteDialog = () => {
		const { openDelete } = this.state
		const { t } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.org')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.org', { org: this.state.org.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={this.handleDeleteOrg} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.orgDeleted')
				break
			default:
				break
		}
	}
	tabs = [
		{ id: 0, title: '', label: <Business />, url: `#details` },
		{ id: 1, title: '', label: <People />, url: `#users` },
		{ id: 2, title: '', label: <LibraryBooks />, url: `#projects` },
		{ id: 3, title: '', label: <DataUsage />, url: `#collections` },
		{ id: 4, title: '', label: <DeviceHub />, url: `#devices` }
	]
	render() {
		const { classes, t, history, match, language } = this.props
		const { org, loading, loadingUsers, loadingDevices, loadingProjects, loadingCollections, users, devices, collections, projects } = this.state
		return (
			loading ? <CircularLoader /> : <Fade in={true}>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} noMargin id={'details'}> 
						<OrgDetails
							isFav={this.props.isFav({ id: org.id, type: 'org' })}
							addToFav={this.addToFav}
							removeFromFav={this.removeFromFav}
							deleteOrg={this.handleOpenDeleteDialog}
							match={match}
							history={history}
							classes={classes}
							t={t}
							org={org}
							language={language}
							accessLevel={this.props.accessLevel}
							devices={devices ? devices.length : 0}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'users'}>
						{!loadingUsers ? <OrgUsers
							t={t}
							org={org}
							users={users ? users : []}
							history={history}
						/> :
							<CircularLoader notCentered />}
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'projects'}>
						{!loadingProjects ? <OrgProjects
							t={t}
							org={org}
							projects={projects ? projects : []}
							history={history} />
							:
							<CircularLoader notCentered />
						}
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'collections'}>
						{!loadingCollections ? <OrgCollections
							t={t}
							org={org}
							collections={collections ? collections : []}
							history={history} />
							:
							<CircularLoader notCentered />
						}
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'devices'}>
						{!loadingDevices ? <OrgDevices
							t={t}
							org={org}
							devices={devices ? devices : []}
							history={history} />
							:
							<CircularLoader notCentered />
						}
					</ItemGrid>
					{this.renderDeleteDialog()}
				</GridContainer>
			</Fade>
		)
	}
}
const mapStateToProps = (state) => ({
	language: state.localization.language,
	accessLevel: state.settings.user.privileges,
	saved: state.favorites.saved
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(userStyles)(Org))
