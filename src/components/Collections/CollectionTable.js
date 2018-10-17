import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, withStyles
} from "@material-ui/core"
import TC from 'components/Table/TC'
// import { Delete, Edit, PictureAsPdf/*  Add */ } from 'variables/icons'
import devicetableStyles from "assets/jss/components/devices/devicetableStyles"
import PropTypes from "prop-types"
import React, { Fragment } from "react"
import { withRouter } from 'react-router-dom'
import EnhancedTableHead from 'components/Table/TableHeader'
// import EnhancedTableToolbar from 'components/Table/TableToolbar'
import { connect } from "react-redux"
import TP from 'components/Table/TP'
import { Info, Caption, ItemG } from "components";
import { dateFormatter } from 'variables/functions';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
class CollectionTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 0,
			rowsPerPage: props.rowsPerPage,
			anchorFilterMenu: null,
			openDelete: false,
		}
	}

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	handleSelectAllClick = (event, checked) => {
		this.props.handleSelectAllClick(event, checked)
	}

	handleClick = (event, id) => {
		this.props.handleClick(event, id)
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value })
	}


	isSelected = id => this.props.selected.indexOf(id) !== -1

	handleEdit = () => {
		this.props.history.push(`/collection/${this.state.selected[0]}/edit`)
	}
	
	addNewCollection = () => { this.props.history.push('/collections/new') }


	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1:
				return <div title={t("devices.status.yellow")}><SignalWifi2Bar className={classes.yellowSignal} /></div>
			case 2:
				return <div title={t("devices.status.green")}><SignalWifi2Bar className={classes.greenSignal} /></div>
			case 0:
				return <div title={t("devices.status.red")}><SignalWifi2Bar className={classes.redSignal} /></div>
			case null:
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}

	render() {
		const { classes, t, order, orderBy, data, selected } = this.props
		const { rowsPerPage, page } = this.state
		let emptyRows;
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
		return (
			<Fragment>
				
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead // ./ProjectTableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							t={t}
							classes={classes}
							// mdDown={[0]} //Which Columns to display on small Screens
							customColumn={[{ id: "name", label: t("collections.fields.collection") }]}
						/>

						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/collection/' + n.id) }}
										// onContextMenu={this.handleToolbarMenuOpen}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
												<Checkbox checked={isSelected} />
											</TableCell>
											<TC content={
												<ItemG container alignItems={"center"}>
													<ItemG>
														<Info noWrap paragraphCell={classes.noMargin}>
															{n.name}
														</Info>
														<ItemG>
															<Caption noWrap className={classes.noMargin}>

																{`${n.org ? n.org.name : ""}`}
															</Caption>
														</ItemG>
													</ItemG>
												</ItemG>
											}

											/>
										</Hidden>
										<Hidden mdDown>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
												<Checkbox checked={isSelected} />
											</TableCell>
											<TC  label={n.name} />
											<TC className={classes.tablecellcheckbox} FirstC content={n.activeDeviceStats ? this.renderIcon(n.activeDeviceStats.state) : null} />
											<TC label={dateFormatter(n.created)} />
											<TC label={n.devices ? n.devices[0] ? dateFormatter(n.devices[0].start) : "" : ""} />
											<TC label={n.org ? n.org.name : ""} />
										</Hidden>
									</TableRow>
								)
							}) : null}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 /* * emptyRows */ }}>
									<TableCell colSpan={8} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TP
					count={data ? data.length : 0}
					classes={classes}
					rowsPerPage={rowsPerPage}
					page={page}
					t={t}
					handleChangePage={this.handleChangePage}
					handleChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
				{/* {this.renderConfirmDelete()} */}
			</Fragment>

		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.settings.trp,
	language: state.localization.language,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

CollectionTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(CollectionTable)))