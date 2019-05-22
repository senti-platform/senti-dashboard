import React, { Component } from 'react'
import { connect } from 'react-redux'
// import UpdateRegistryForm from 'components/Collections/UpdateRegistryForm';
import { getRegistryLS } from 'redux/data';
import { updateRegistry } from 'variables/dataRegistry';
import UpdateRegistryForm from 'components/Registry/CreateRegistryForm';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';

class UpdateRegistry extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			registry: null
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
		props.setHeader('registries.updateRegistry', true, prevURL, '')
		props.setBC('updateregistry')
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToRegistries()
		}
	}
	getData = async () => {
		const { getRegistry } = this.props
		await getRegistry(this.id)
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { location, setHeader, registry } = this.props
		if ((!prevProps.registry && registry !== prevProps.registry && registry) || (this.state.registry === null && registry)) {
			this.setState({
				registry: registry,
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/registry/${this.id}`
			setHeader('registries.editRegistry', true, prevURL, 'registries')
			this.props.setBC('editregistry', registry.name, registry.id)
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
			registry: {
				...this.state.registry,
				[what]: e.target.value
			}
		})
	}
	updateRegistry = async () => {
		return await updateRegistry(this.state.registry)
	}
	handleUpdate = async () => {
		const { s, history } = this.props
		let rs = await this.updateRegistry()
		if (rs) {
			s('snackbars.registryUpdated')
			history.push(`/registry/${this.id}`)
		}
		else
			s('snackbars.failed')
	}
	goToRegistries = () => this.props.history.push('/registries')
	render() {
		const { t } = this.props
		const { loading, registry } = this.state
		return ( loading ? <CircularLoader/> :

			<UpdateRegistryForm
				registry={registry}
				handleChange={this.handleChange}
				handleCreate={this.handleUpdate}
				goToRegistries={this.goToRegistries}
				t={t}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	// accessLevel: state.settings.user.privileges,
	// orgId: state.settings.user.org.id
	registry: state.data.registry
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getRegistry: async id => dispatch(await getRegistryLS(1, id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateRegistry)