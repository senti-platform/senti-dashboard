import React, { Component, Fragment } from 'react'
import DashboardCard from 'components/Cards/DashboardCard';
import imgs from 'assets/img/Squared';
import { connect } from 'react-redux'
import { Dialog, AppBar, Toolbar, Hidden, IconButton, withStyles, ButtonBase, Paper, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core';
import { ItemG, T, CircularLoader, SlideT } from 'components';
import { Close, Edit, ContentCopy } from 'variables/icons';
import cx from 'classnames'
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import GaugeSData from 'views/Charts/GaugeSData';
import DoubleChart from 'views/Charts/DoubleChart';
import logo from '../../logo.svg'
import ScorecardAB from 'views/Charts/ScorecardAB';
import Scorecard from 'views/Charts/Scorecard';
import WindCard from 'views/Charts/WindCard';
import { Responsive, WidthProvider } from "react-grid-layout";
import { ThemeProvider } from '@material-ui/styles';
import { darkTheme, lightTheme } from 'variables/themes';
import { graphType } from 'variables/dsSystem/graphTypes';
import { removeDashboard } from 'redux/dsSystem';
import { /* encrypyAES, */ copyToClipboard, selectAll } from 'variables/functions';
import withSnackbar from 'components/Localization/S';
import SB from 'components/Scrollbar/SB';
import MapData from 'views/Charts/MapData';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class DashboardPanel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openDashboard: false,
			openShare: false,
			initialLayout: props.initialLayout
		}
	}

	handleOpenDashboard = () => {
		this.setState({
			openDashboard: true
		})
	}
	handleCloseDashboard = () => {
		this.setState({
			openDashboard: false
		})
	}
	renderPos = (l) => {
		return <div style={{
			position: 'absolute',
			top: '50%',
			left: '50%',
			zIndex: '9999',
			background: 'white',
			fontSize: '24px',
			padding: '20px',
			transformOrigin: 'center',
			transform: 'translate(-50%, -50%)', backgroundColor: "#000"
		}}>
			[{l.x}, {l.y}, {l.w}, {l.h}]
		</div>
	}
	componentDidMount() {
		this.setState({
			initialLayout: this.props.initialLayout
		})
	}

	onLayoutChange = (args) => {
		this.setState({
			initialLayout: {
				lg: args
			}
		})
	}
	gridCoords = (type) => {
		switch (type) {
			case 0:
				return 'chart'
			case 1:
				return 'gauge'
			case 2:
				return 'scorecardAB'
			case 3:
				return 'scorecard'
			case 4:
				return 'windcard'
			case 5:
				return 'map'
			default:
				break;
		}
	}
	onBreakpointChange = (args) => {
		// console.log(args)
	}
	handleOpenShare = () => {
		this.setState({
			openShare: true
		})
	}
	handleCloseShare = () => {
		this.setState({
			openShare: false
		})
	}
	handleCopyToClipboard = () => {
		const { s, d } = this.props
		let str = JSON.stringify(d, null, 4)
		copyToClipboard(str)
		s('snackbars.copied')
	}
	renderShareDashboard = () => {
		const { t, d, classes } = this.props
		const { openShare } = this.state
		if (d) {
			const encrypted = JSON.stringify(d, null, 4)
			return <Dialog
				open={openShare}
				onClose={this.handleCloseShare}
				PaperProps={{
					style: {
						width: '100%'

					}
				}}
			>
				<DialogTitle>{t('dialogs.dashboards.share.title')}</DialogTitle>
				<DialogContent>
					<ItemG container justify='center'>

						<ItemG xs={12}>
							<div className={classes.exportTArea}>
								<SB>

									<pre id={'pre' + d.id} onClick={() => selectAll('pre' + d.id)}>
										{encrypted}

									</pre>
									{/* <ContentEditable
										html={<pre>
											{encrypted}
										</pre>}
										style={{ width: '100%', height: '100%' }}>
									</ContentEditable> */}
								</SB>
							</div>
						</ItemG>
						<ItemG xs={12}>

							<Button onClick={this.handleCopyToClipboard}>
								<ContentCopy style={{ marginRight: 8 }} />
								{t('actions.copyToClipboard')}
							</Button>
						</ItemG>
					</ItemG>
				</DialogContent>
				<DialogActions></DialogActions>
			</Dialog>
		}
	}
	renderDashboard = () => {
		const { t, classes, d, loading, handleOpenEDT } = this.props
		const { openDashboard } = this.state
		const { handleCloseDashboard } = this
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openDashboard}
			onClose={handleCloseDashboard}
			TransitionComponent={SlideT}>
			<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={1}>
								<div className={classes.logo}>
									<ButtonBase
										focusRipple
										className={classes.image}
										focusVisibleClassName={classes.focusVisible}
										style={{
											width: '120px'
										}}
									>
										<span
											className={classes.imageSrc}
											style={{
												backgroundImage: `url(${logo})`
											}}
										/>
									</ButtonBase>
								</div>
							</ItemG>
							<ItemG xs={10} container alignItems={'center'} justify={'center'}>
								<T variant='h6' color='inherit' className={classes.flex}>
									{d.name}
								</T>
							</ItemG>
							<ItemG xs={1} container justify={'flex-end'}>
								<IconButton color='inherit' onClick={() => { handleOpenEDT(d); handleCloseDashboard(); }} aria-label='Close'>
									<Edit />
								</IconButton>
								<IconButton color='inherit' onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={11} container alignItems={'center'}>
								<T variant='h6' color='inherit' className={classes.flex}>
									{d.name}
								</T>
							</ItemG>
							<ItemG xs={1} container justify={'flex-end'}>
								<IconButton color={'inherit'} onClick={handleCloseDashboard} aria-label='Close'>
									<Close />
								</IconButton>

							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			{
				loading ? <CircularLoader /> : <div className={classes[d.color]} style={{ height: 'calc(100%)', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
					<ResponsiveReactGridLayout
						{...this.props}
						onBreakpointChange={this.onBreakpointChange}
						onLayoutChange={this.onLayoutChange}
						// measureBeforeMount={true}
						useCSSTransforms={this.state.mounted}
						isResizable={false}
						isDraggable={false}
					>
						{d.graphs.map((g, i) => {
							let grid = g.grid ? g.grid : graphType(this.gridCoords(g.type)).grid
							switch (g.type) {
								case 1:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										{/* {this.renderPos(grid)} */}
										<GaugeSData
											title={g.name}
											period={{ ...g.period, menuId: g.periodType }}
											t={t}
											color={d.color}
											gId={g.id}
											dId={d.id}
											single
										/>
									</Paper>
								case 0:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										{/* {this.renderPos(grid)} */}
										<DoubleChart
											title={g.name}
											g={g}
											period={{ ...g.period }}
											gId={g.id}
											dId={d.id}
											color={d.color}
											single={true}
											t={t}
										/>
									</Paper>
								case 2:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										{/* {this.renderPos(grid)} */}
										<ScorecardAB
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											single={true}
											t={t}
										/>
									</Paper>
								case 3:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										{/* {this.renderPos(grid)} */}
										<Scorecard
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											single={true}
											t={t}
										/>
									</Paper>
								case 4:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										{/* {this.renderPos(grid)} */}
										<WindCard
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											single={true}
											t={t}
										/>
									</Paper>
								case 5:
									return <Paper style={{ background: 'inherit' }} key={g.id} data-grid={grid}>
										{/* {this.renderPos(grid)} */}
										<MapData
											color={d.color}
											title={g.name}
											gId={g.id}
											dId={d.id}
											t={t}
										/>
									</Paper>
								default:
									return null;
							}

						})}
					</ResponsiveReactGridLayout>
				</div>
			}
		</Dialog >
	}
	handleDeleteDashboard = () => {
		const { d } = this.props
		this.props.removeDashboard(d.id)
	}
	handleEditDashboard = () => {
		const { d } = this.props
		this.props.handleOpenEDT(d)
	}
	render() {
		const { d, data, t, dsTheme } = this.props

		return (
			<Fragment>
				<ThemeProvider theme={dsTheme === 0 ? lightTheme : darkTheme}>
					{this.renderDashboard()}
				</ThemeProvider>
				{this.renderShareDashboard()}
				<ItemG xs={12} md={4} lg={3} xl={2}>
					<DashboardCard
						deleteDashboard={this.handleDeleteDashboard}
						handleOpenDashboard={this.handleOpenDashboard}
						handleEditDashboard={this.handleEditDashboard}
						handleOpenShare={this.handleOpenShare}
						data={data}
						header={d.name}
						img={imgs.data}
						content={d.description}
						c={d.color}
						t={t}
					/>
				</ItemG>
			</Fragment>
		)
	}
}
DashboardPanel.defaultProps = {
	className: "layout",
	rowHeight: 25,
	preventCollision: false,
	onLayoutChange: () => { },
	cols: { lg: 12, md: 6, sm: 4, xs: 3, xxs: 3 },


};
const mapStateToProps = (state, ownProps) => ({
	// loading: state.dsSystem.gotDashboardData
	dsTheme: state.settings.dsTheme
})

const mapDispatchToProps = (dispatch) => ({
	removeDashboard: (id) => dispatch(removeDashboard(id))
})

export default withSnackbar()(withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(DashboardPanel)))
