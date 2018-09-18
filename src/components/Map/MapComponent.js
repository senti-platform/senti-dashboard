import React, { Component } from 'react'
import MarkerWithInfo from './MarkerWithInfo';
import { GoogleMap } from 'react-google-maps';
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

class MapComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			init: false
		}
		this.map = React.createRef()
	}

	setCenterAndZoom() {
		if (!this.state.init) {
			const bounds = new window.google.maps.LatLngBounds()
			console.log(this.props.markers)
			this.props.markers.forEach(bound => {
				console.log(bound.lat, bound.long)
				if (bound.lat && bound.long)
					return (
						bounds.extend(new window.google.maps.LatLng(bound.lat, bound.long))
					)
			})
			console.log(this.map.current)
			console.log(bounds)
			this.map.current.fitBounds(bounds)
			// this.map.current.LatLng(bounds)
			this.map.current.panToBounds(bounds, 10);
		}
		this.setState({
			init: true
		})
	}
	
	render() {
		let props = this.props
		let defaultLat = parseFloat(56.2639) //Denmark,
		let defaultLng = parseFloat(9.5018) //Denmark
		// if (!props.centerDenmark) {
		// 	defaultLat = props.markers[0] ? props.markers[0].lat : defaultLat
		// 	defaultLng = props.markers[0] ? props.markers[0].long : defaultLng
		// }
		return <GoogleMap
			defaultZoom={props.zoom ? props.zoom : 7}
			defaultCenter={{ lat: defaultLat, lng: defaultLng }}
			ref={this.map}
			onTilesLoaded={() => this.setCenterAndZoom()}
			// ref={map => this.map = map && console.log(map)/* map.fitBounds(bounds) */}
		>

			<MarkerClusterer
				onClick={props.onMarkerClustererClick}
				// averageCenter
				enableRetinaIcons
				gridSize={8}
			>
				{props.markers.length > 0 ? props.markers.map((m, i) => {
					if (m.lat && m.long)
						return <MarkerWithInfo t={props.t} key={i} m={m} i={i} />
					else
						return null
				})
					: null}
			</MarkerClusterer>
		</GoogleMap>
	}
}

export default MapComponent
