import React, { Component } from 'react'
import { connect } from 'react-redux'
// import EditSensorForm from 'components/Collections/EditSensorForm';
import { getSensorLS } from 'redux/data';
import { updateSensor } from 'variables/dataRegistry';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import CreateSensorForm from 'components/Sensors/CreateSensorForm';
import { getAddressByLocation } from 'variables/dataDevices';

class EditSensor extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			sensor: {
				reg_id: 0,
				type_id: 0,
				lat: 56.2639,
				lng: 9.5018,
				address: '',
				locType: 0,
				name: '',
				customer_id: 1,
				communication: 1
			},
			openCF: {
				open: false,
				where: null
			},
			openReg: false,
			openDT: false,
			select: {
				dt: {
					name: ""
				},
				reg: {
					name: ""
				},

			},
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/sensors/list'
		props.setHeader('menus.edit.sensor', true, prevURL, '')
		props.setBC('editsensor')
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToSensors()
		}
	}
	getData = async () => {
		const { getSensor } = this.props
		await getSensor(this.id)
	}
	getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let lng = e.target._latlng.lng
		let newAddress = await getAddressByLocation(lat, lng)
		let address = this.state.sensor.address
		if (newAddress) {
			if (!address || !address.includes(newAddress.vejnavn)) {
				address = `${newAddress.vejnavn} ${newAddress.husnr}, ${newAddress.postnr} ${newAddress.postnrnavn}`
			}
		}
		this.setState({
			sensor: {
				...this.state.sensor,
				lat,
				lng,
				address }
		})

	}
	componentDidUpdate = (prevProps, prevState) => {
		const { location, setHeader, sensor, deviceTypes, registries } = this.props
		if ((!prevProps.sensor && sensor !== prevProps.sensor && sensor) || (this.state.registry === null && sensor)) {
			this.setState({
				sensor: { ...sensor },
				sensorMetadata: {
					outbound: sensor.dataKeys ? sensor.dataKeys : [],
					inbound: sensor.inbound ? sensor.inbound : []
				},
				select: {
					dt: {
						...deviceTypes[deviceTypes.findIndex(dt => dt.id === sensor.type_id)]
					},
					reg: {
						...registries[registries.findIndex(r => r.id === sensor.reg_id)]
					}
				},
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/sensor/${this.id}`
			setHeader('menu.edit.sensor', true, prevURL, 'sensors')
			this.props.setBC('editsensor', sensor.name, sensor.id)
		}
	}
	componentDidMount = async () => {
		this.getData()
		window.addEventListener('keydown', this.keyHandler, false)

	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)
	}

	handleChange = (what) => e => {
		this.setState({
			sensor: {
				...this.state.sensor,
				[what]: e.target.value
			}
		})
	}
	handleOpenDT = () => {
		this.setState({
			openDT: true
		})
	}
	handleCloseDT = () => {
		this.setState({
			openDT: false
		})
	}
	handleChangeDT = (o) => e => {
		this.setState({
			sensor: {
				...this.state.sensor,
				type_id: o.id
			},
			sensorMetadata: {
				// ...this.state.sensorMetadata,
				inbound: o.inbound ? o.inbound.map((n, i) => ({ id: i, ...n })) : [],
				outbound: o.outbound ? o.outbound.map((d, i) => ({ id: i,  ...d })) : []	
			},
			openDT: false,
			select: {
				...this.state.select,
				dt: o
			}
		})
	}
	handleRemoveInboundFunction = k => e => {
		let mtd = this.state.sensorMetadata.inbound
		mtd = mtd.filter(v => v.nId !== k.nId && v.id !== k.id)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				inbound: mtd
			}
		})
	}
	handleAddInboundFunction = e => { 
		let mtd = this.state.sensorMetadata.inbound
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				inbound: [...mtd, { id: mtd.length, order: mtd.length, nId: -1 }]
			}
		})
	}
	handleRemoveFunction = (k) => e => {
		let mtd = this.state.sensorMetadata.outbound
		mtd[mtd.findIndex(v => v.key === k.key && v.nId === k.nId)].nId = -1
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: mtd
			}
		})
	}
	handleRemoveKey = (k) => e => {
		let newMetadata = this.state.sensorMetadata.outbound.filter((v) => v.key !== k.key)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: newMetadata
			}
		})
	}
	handleAddKey = e => { 
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: [...this.state.sensorMetadata.outbound, { key: '', nId: -1 }]
			}
		})
	}
	handleOpenFunc = (p, where) => e => {
		this.setState({
			select: {
				...this.state.select,
				[where]: p
			},
			openCF: {
				open: true,
				where: where
			}
		})
	}
	handleCloseFunc = () => {
		this.setState({
			openCF: {
				open: false,
				where: null
			}
		})
	}
	handleChangeFunc = (o, where) => e => {
		let metadata = this.state.sensorMetadata[where]
		metadata[metadata.findIndex(f => f.id === this.state.select[where].id)].nId = o.id
		this.setState({
			openCF: {
				open: false,
				where: null
			},
			sensorMetadata: {
				...this.state.sensorMetadata,
				[where]: metadata
			}
		})
	}
	handleChangeInboundFunc = (o) => e => {
		console.log(o)
		let metadata = this.state.sensorMetadata.inbound
		metadata[this.state.select.inbound.id].nId = o.id
		console.log(metadata)
		this.setState({
			openCF: false,
			sensorMetadata: {
				...this.state.sensorMetadata,
				inbound: metadata
			}
		})
	}
	handleOpenReg = () => {
		this.setState({
			openReg: true
		})
	}
	handleCloseReg = () => {
		this.setState({
			openReg: false
		})
	}
	handleChangeReg = (o) => e => {
		this.setState({
			sensor: {
				...this.state.sensor,
				reg_id: o.id
			},
			openReg: false,
			select: {
				...this.state.select,
				reg: o
			}
		})
	}
	updateDevice = async () => {
		let newSensor = {
			...this.state.sensor,
			tags: [],
			// available: 1,
			metadata: {
				...this.state.sensorMetadata
			}
		}
		return await updateSensor(newSensor)
	}
	handleCreate = async () => {
		const { s, history } = this.props
		let rs = await this.updateDevice()
		if (rs) {
			s('snackbars.registryCreated')
			history.push(`/sensor/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	goToSensors = () => this.props.history.push('/sensors')
	render() {
		const { t, cloudfunctions } = this.props
		const { sensor, sensorMetadata, loading } = this.state
		return ( loading ? <CircularLoader/> :

			<CreateSensorForm
				sensor={sensor}
				sensorMetadata={sensorMetadata}
				cfunctions={cloudfunctions}
				handleOpenFunc={this.handleOpenFunc}
				handleCloseFunc={this.handleCloseFunc}
				handleChangeFunc={this.handleChangeFunc}
				handleRemoveFunction={this.handleRemoveFunction}
				handleRemoveInboundFunction={this.handleRemoveInboundFunction}
				handleAddInboundFunction={this.handleAddInboundFunction}
				openCF={this.state.openCF}
			
				handleAddKey={this.handleAddKey}
				handleRemoveKey={this.handleRemoveKey}
			
				handleChange={this.handleChange}
				handleCreate={this.handleCreate}
			
				handleOpenDT={this.handleOpenDT}
				handleCloseDT={this.handleCloseDT}
				handleChangeDT={this.handleChangeDT}
				openDT={this.state.openDT}
				deviceTypes={this.props.deviceTypes}
			
				registries={this.props.registries}
				handleOpenReg={this.handleOpenReg}
				handleCloseReg={this.handleCloseReg}
				handleChangeReg={this.handleChangeReg}
				openReg={this.state.openReg}


				goToSensors={this.goToSensors}
				select={this.state.select}
				getLatLngFromMap={this.getLatLngFromMap}
				t={t}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	registries: state.data.registries,
	deviceTypes: state.data.deviceTypes,
	cloudfunctions: state.data.functions,
	sensor: state.data.sensor
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getSensor: async (id, customerID, ua) => dispatch(await getSensorLS(id, customerID, ua)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSensor)
