import {
	IconButton, Paper, withStyles, DialogTitle, Dialog, DialogContent,
	DialogContentText, DialogActions, Button, List, ListItem, ListItemIcon, ListItemText, Fade, Tooltip
} from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import GridContainer from 'components/Grid/GridContainer';
import CircularLoader from 'components/Loader/CircularLoader';
import ProjectCards from 'components/Project/ProjectCards';
import ProjectTable from 'components/Project/ProjectTable';
import TableToolbar from 'components/Table/TableToolbar';
// import Toolbar from 'components/Toolbar/Toolbar';
import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { deleteProject, /* getAllProjects */ } from 'variables/dataProjects';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Add, Delete, Edit, PictureAsPdf, ViewList, ViewModule, DataUsage, Star, StarBorder } from 'variables/icons';
import AssignDCs from 'components/AssignComponents/AssignDCs';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { connect } from 'react-redux'
import { customFilterItems } from 'variables/Filters';
// import { makeCancelable } from 'variables/data';
import { getProjects, setProjects, sortData } from 'redux/data';
import FilterToolbar from 'components/Table/FilterToolbar';

class Projects extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			openDelete: false,
			route: 0,
			order: 'asc',
			orderBy: 'title',
			openAssignDC: false,
			filters: {
				keyword: '',
			}
		}
		props.setHeader('projects.pageTitle', false, '', 'projects')
		props.setBC('projects')
	}
	options = () => {
		const { t, isFav, projects } = this.props
		const { selected } = this.state
		let project = projects[projects.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
		}
		let isFavorite = isFav(favObj)
		return [
			{ label: t('menus.edit'), func: this.handleEditProject, single: true, icon: Edit },
			{ label: t('menus.assign.collectionsToProject'), func: this.handleOpenAssignCollection, single: true, icon: DataUsage },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete }
		]
	}

	tabs = () => {
		const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.path}/list` },
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.path}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.path}/favorites` },
		]
	}
	ft = () => {
		const { t } = this.props
		return [
			{ key: 'title', name: t('projects.fields.name'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'startDate', name: t('projects.fields.startDate'), type: 'date' },
			{ key: 'endDate', name: t('projects.fields.endDate'), type: 'date' },
			{ key: 'created', name: t('projects.fields.created'), type: 'date' },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]

	}
	projectHeader = () => {
		const { t } = this.props
		return [
			{ id: 'title', label: t('projects.fields.title'), },
			{ id: 'startDate', label: t('projects.fields.startDate'), },
			{ id: 'endDate', label: t('projects.fields.endDate'), },
			{ id: 'created', label: t('projects.fields.created'), },
			{ id: 'modified', label: t('projects.fields.lastUpdate'), },
		]
	}
	//#endregion

	//#region Functions

	getFavs = () => {
		const { order, orderBy } = this.state
		let favorites = this.props.favorites.filter(f => f.type === 'project')
		let favProjects = favorites.map(f => {
			return this.props.projects[this.props.projects.findIndex(d => d.id === f.id)]
		})
		favProjects = handleRequestSort(orderBy, order, favProjects)
		return favProjects
	}

	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}

	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}

	getData = async (reload) => {
		const { getProjects, setProjects } = this.props
		setProjects()
		if (reload)
			getProjects(true)
	}

	filterItems = (data) => {
		let { filters } = this.state
		return customFilterItems(filterItems(data, filters), this.props.filters)
	}

	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.collectionsToProject')
				break
			default:
				break;
		}
	}

	deleteProjects = async (projects) => {
		const { selected } = this.state
		Promise.all([selected.map(s => {
			// this.removeFromFav({ id: s })
			return deleteProject(s)
		})]).then(async () => {
			this.setState({ openDelete: false, selected: [] })
			this.snackBarMessages(1)
			await this.getData()
		})
	}

	//#endregion

	//#region Life Cycle

	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		this.getData()
		this.props.setTabs({
			id: 'projects',
			route: this.handleTabs(),
			tabs: this.tabs()
		})
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.handleTabs()
		}
		this.props.setTabs({
			id: 'projects',
			route: this.handleTabs(),
			// data: projects,
			// filters: filters,
			handleFilterKeyword: this.handleFilterKeyword,
			tabs: this.tabs()
		})
		if (this.props.saved === true) {
			const { projects } = this.props
			const { selected } = this.state
			let project = projects[projects.findIndex(d => d.id === selected[0])]
			if (project) {
				if (this.props.isFav({ id: project.id, type: 'project' })) {
					this.props.s('snackbars.favorite.saved', { name: project.title, type: this.props.t('favorites.types.project') })
					this.props.finishedSaving()
					this.setState({ selected: [] })
				}
				if (!this.props.isFav({ id: project.id, type: 'project' })) {
					this.props.s('snackbars.favorite.removed', { name: project.title, type: this.props.t('favorites.types.project') })
					this.props.finishedSaving()
					this.setState({ selected: [] })
				}
			}
		}
	}
	componentWillUnmount = () => {
		// this.getProjects.cancel()
		// this._isMounted = 0
	}

	//#endregion

	//#region Handlers
	handleProjectClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: `/project/${id}`, prevURL: '/projects' })
	}

	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: `/project/${id}`, prevURL: '/projects/favorites' })
	}

	handleTabs = () => {
		if (this.props.location.pathname.includes('grid')) {
			// this.setState({ route: 1 })

			return 1
		}
		else {
			if (this.props.location.pathname.includes('favorites')) {
				// this.setState({ route: 2 })
				return 2
			}
			else {
				// this.setState({ route: 0 })
				return 0
			}
		}
	}
	handleAddProject = () => this.props.history.push('/projects/new')

	handleEditProject = () => this.props.history.push(`/project/${this.state.selected[0]}/edit`)

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	handleOpenAssignCollection = () => {
		this.setState({ openAssignDC: true, anchorElMenu: null })
	}

	handleCloseAssignCollection = async (reload) => {
		if (reload) {
			this.setState({ openAssignDC: false })
			await this.getData(reload).then(rs => {
				this.snackBarMessages(3)
			})
		}
		else {
			this.setState({ openAssignDC: false })
		}
	}

	handleRequestSort = key => (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		this.props.sortData(key, property, order)
		// handleRequestSort(property, order, this.props.projects)
		this.setState({ order, orderBy: property })
	}

	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.projects.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id)
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected })
	}

	//#endregion

	//#region Render
	renderConfirmDelete = () => {
		const { selected, openDelete } = this.state
		const { t, handleCloseDeleteDialog, projects } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.projects')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.projects')}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={projects[projects.findIndex(d => d.id === s)].title} /></ListItem>)}

				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.deleteProjects} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderTableToolBarContent = () => {
		const { t } = this.props
		return <Tooltip title={t('menus.create.project')}>
			<IconButton aria-label='Add new project' onClick={this.handleAddProject}>
				<Add />
			</IconButton>
		</Tooltip>
	}
	renderTable = (items, handleClick, key) => {
		const { t } = this.props
		const { order, orderBy, selected } = this.state
		return <ProjectTable
			selected={selected}
			data={this.filterItems(items)}
			handleSelectAllClick={this.handleSelectAllClick}
			tableHead={this.projectHeader()}
			handleClick={handleClick}
			handleRequestSort={this.handleRequestSort(key)}
			handleCheckboxClick={this.handleCheckboxClick}
			order={order}
			orderBy={orderBy}
			t={t}
		/>
	}
	renderAssignDCs = () => {
		const { selected, openAssignDC } = this.state
		const { t } = this.props
		return selected[0] ? <AssignDCs
			open={openAssignDC}
			handleClose={this.handleCloseAssignCollection}
			project={selected[0]}
			t={t}
		/> : null
	}
	renderTableToolbar = () => {
		const { selected } = this.state
		const { t } = this.props
		return <TableToolbar
			ft={this.ft()}
			reduxKey={'projects'}
			numSelected={selected.length}
			options={this.options}
			t={t}
			content={this.renderTableToolBarContent()}
		/>
	}
	renderToolbar = () => {
		return  <FilterToolbar
			reduxKey={'projects'}
			// filters={props.ft}
			t={this.props.t}
		/>
	}
	renderAllProjects = () => {
		const { classes, projects, loadingProjects } = this.props
		return loadingProjects ? <CircularLoader /> :
			<Fade in={true}><Paper className={classes.root}>
				{this.renderConfirmDelete()}
				{this.renderAssignDCs()}
				{this.renderTableToolbar()}
				{this.renderTable(projects, this.handleProjectClick, 'projects')}
			</Paper></Fade>
	}

	renderList = () => {
		return <GridContainer justify={'center'}>
			{this.renderAllProjects()}
		</GridContainer>
	}
	renderFavorites = () => {
		const { classes, loadingProjects } = this.props
		return <GridContainer justify={'center'}>
			{loadingProjects ? <CircularLoader /> : <Fade in={true}>
				<Paper className={classes.root}>
					{this.renderConfirmDelete()}
					{this.renderAssignDCs()}
					{this.renderTableToolbar()}
					{this.renderTable(this.getFavs(), this.handleFavClick, 'favorites')}
				</Paper>
			</Fade>}
		</GridContainer>
	}
	renderCards = () => {
		const { t, loadingProjects, projects } = this.props
		return loadingProjects ? <CircularLoader /> :
			<Fade in={true}><ProjectCards t={t} projects={this.filterItems(projects)} /></Fade>
	}
	render() {
		const { match } = this.props
		return (
			<Fragment>
				{/* {this.renderToolbar()} */}
				<Switch>
					<Route path={`${match.path}/grid`} render={() => this.renderCards()} />
					<Route path={`${match.path}/list`} render={() => this.renderList()} />
					<Route path={`${match.path}/favorites`} render={() => this.renderFavorites()} />
					<Redirect path={`${match.path}`} to={`${match.path}/list`} />
				</Switch>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	favorites: state.data.favorites,
	saved: state.favorites.saved,
	projects: state.data.projects,
	loadingProjects: !state.data.gotprojects,
	filters: state.appState.filters.projects
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),	
	getProjects: (reload) => dispatch(getProjects(reload)),
	setProjects: () => dispatch(setProjects()),
	sortData: (key, property, order) => dispatch(sortData(key, property, order))
})


export default withStyles(projectStyles)(connect(mapStateToProps, mapDispatchToProps)((Projects)))