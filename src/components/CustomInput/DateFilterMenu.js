import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Divider, MenuItem, Menu, IconButton, withStyles, Button } from '@material-ui/core';
import { ItemGrid, Info, CustomDateTime, ItemG } from 'components';
import { dateTimeFormatter } from 'variables/functions';
import moment from 'moment'
import { DateRange } from 'variables/icons';
import teal from '@material-ui/core/colors/teal'
import { connect } from 'react-redux'
import { changeDate, changeHeatMapDate } from 'redux/dateTime';

const styles = theme => ({
	selected: {
		backgroundColor: `${teal[500]} !important`,
		color: "#fff"
	},

})

/**
* @augments {Component<{	classes:object,	to:instanceOf(Date),	from:instanceOf(Date),	t:Function,	dateFilterInputID:number,	handleDateFilter:Function,>}
*/
class DateFilterMenu extends Component {
	constructor(props) {
		super(props)

		this.state = {
			timeType: props.period !== undefined ? props.period.timeType : 2,
		}
	}
	timeTypes = [
		{ id: 0, format: 'lll', chart: 'minute' },
		{ id: 1, format: 'lll', chart: 'hour' },
		{ id: 2, format: 'll', chart: 'day' },
		{ id: 3, format: 'll', chart: 'day' },
	]
	options = [
		{ id: 0, label: this.props.t('filters.dateOptions.today') },
		{ id: 1, label: this.props.t('filters.dateOptions.yesterday') },
		{ id: 2, label: this.props.t('filters.dateOptions.thisWeek') },
		{ id: 3, label: this.props.t('filters.dateOptions.7days') },
		{ id: 4, label: this.props.t('filters.dateOptions.30days') },
		{ id: 5, label: this.props.t('filters.dateOptions.90days') },
		{ id: 6, label: this.props.t('filters.dateOptions.custom') },
	]
	handleSetDate = (id, to, from, timeType) => {
		const { period } = this.props
		let defaultT = 0
		switch (id) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment()
				defaultT = 1
				break;
			case 1: // Yesterday
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().subtract(1, 'd').endOf('day')
				defaultT = 1
				break;
			case 2: // This week
				from = moment().startOf('week').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 3: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 4: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 5: // last 90 days
				from = moment().subtract(90, 'd').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 6:
				from = moment(from)
				to = moment(to)
				defaultT = timeType
				break;
			default:
				break;
		}
		if (this.props.heatmap) {
			this.props.handleSetHeatmapDate(id, to, from, defaultT)
		}
		else { 
			this.props.handleSetDate(id, to, from, defaultT, period ? period.id : -1)
		}

	}

	handleCloseDialog = (to, from, timeType) => {
		const { period } = this.props
		this.setState({ openCustomDate: false, actionAnchor: null })
		this.handleSetDate(6, to, from, timeType, period.id)
	}
	/**
	 * Menu Handling, close the menu and set the date or open Custom Date
	 */
	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 6) {
			this.setState({ actionAnchor: null }, () => this.handleSetDate(id))
		}
		else {
			this.setState({ openCustomDate: true })
		}
	}

	handleCustomCheckBox = (e) => {
		this.setState({ timeType: parseInt(e.target.value, 10) })
	}

	handleCancelCustomDate = () => {
		this.setState({
			loading: false, openCustomDate: false
		})
	}
	renderCustomDateDialog = () => {
		const { period, t } = this.props
		const { openCustomDate } = this.state
		return openCustomDate ? <CustomDateTime
			openCustomDate={openCustomDate}
			handleCloseDialog={this.handleCloseDialog}//
			to={period.to}
			from={period.from}
			timeType={period.timeType}
			handleCustomCheckBox={this.handleCustomCheckBox}//
			handleCancelCustomDate={this.handleCancelCustomDate}//
			t={t}
		/> : null
	}
	handleOpenMenu = e => {
		this.setState({ actionAnchor: e.currentTarget })
	}
	handleCloseMenu = e => {
		this.setState({ actionAnchor: null })
	}

	isSelected = (value) => value === this.props.period ? this.props.period.menuId ? true : false : false

	render() {
		const { period, t, classes, icon, button } = this.props
		const { actionAnchor } = this.state
		let displayTo = period ? dateTimeFormatter(period.to) : ""
		let displayFrom = period ? dateTimeFormatter(period.from) : ""
		return (
			<Fragment>
				{button && <Button
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					style={{ color: 'rgba(0, 0, 0, 0.54)' }}
					onClick={this.handleOpenMenu}>
					{icon ? icon : <DateRange />}
				</Button>}
				{!button && <IconButton
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					onClick={this.handleOpenMenu}>
					{icon ? icon : <DateRange />}
				</IconButton>}
				<Menu
					disableAutoFocus
					disableRestoreFocus
					id='long-menu'
					anchorEl={actionAnchor}
					open={Boolean(actionAnchor)}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					onClose={this.handleCloseMenu}
					getContentAnchorEl={null}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					<ItemG container direction={'column'}>
						{period && <Fragment>
							<ItemGrid>
								<Info>{this.options[this.options.findIndex(d => d.id === period.menuId ? true : false)].label}</Info>
								<Info>{`${displayFrom} - ${displayTo}`}</Info>
							</ItemGrid>
							<Divider />
						</Fragment>}
						<MenuItem selected={this.isSelected(0)} classes={{ selected: classes.selected }} onClick={this.handleDateFilter} value={0}>{t('filters.dateOptions.today')}</MenuItem>
						<MenuItem selected={this.isSelected(1)} classes={{ selected: classes.selected }} onClick={this.handleDateFilter} value={1}>{t('filters.dateOptions.yesterday')}</MenuItem>
						<MenuItem selected={this.isSelected(2)} classes={{ selected: classes.selected }} onClick={this.handleDateFilter} value={2}>{t('filters.dateOptions.thisWeek')}</MenuItem>
						<MenuItem selected={this.isSelected(3)} classes={{ selected: classes.selected }} onClick={this.handleDateFilter} value={3}>{t('filters.dateOptions.7days')}</MenuItem>
						<MenuItem selected={this.isSelected(4)} classes={{ selected: classes.selected }} onClick={this.handleDateFilter} value={4}>{t('filters.dateOptions.30days')}</MenuItem>
						<MenuItem selected={this.isSelected(5)} classes={{ selected: classes.selected }} onClick={this.handleDateFilter} value={5}>{t('filters.dateOptions.90days')}</MenuItem>

						<Divider />
						<MenuItem selected={this.isSelected(6)} classes={{ selected: classes.selected }} onClick={this.handleDateFilter} value={6}>{t('filters.dateOptions.custom')}</MenuItem>
					</ItemG>
					{this.renderCustomDateDialog()}
				</Menu>
			</Fragment>
		)
	}
}
DateFilterMenu.propTypes = {
	classes: PropTypes.object,
	to: PropTypes.instanceOf(moment),
	from: PropTypes.instanceOf(moment),
	t: PropTypes.func,
	dateFilterInputID: PropTypes.number,
	handleDateFilter: PropTypes.func,
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
	handleSetDate: (id, to, from, timeType, pId) => dispatch(changeDate(id, to, from, timeType, pId)),
	handleSetHeatmapDate: (id, to, from, timeType) => dispatch(changeHeatMapDate(id, to, from, timeType))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DateFilterMenu))