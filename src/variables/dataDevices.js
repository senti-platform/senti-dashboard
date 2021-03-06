// import { api, imageApi, weatherApi, dawaApi } from './data';
// import moment from 'moment'

// /* http://dawa.aws.dk/ */
// export const getAddress = async (q) => {
// 	let URL = `/adresser?q=${q}`
// 	let response = await dawaApi.get(URL).then(rs => rs)
// 	return response.ok ? response.data[0] : null
// }
// export const getGeoByAddress = async (id) => {
// 	let URL = `/adresser/${id}`
// 	let response = await dawaApi.get(URL).then(rs => rs)
// 	return response.ok ? response.data : null
// }
// export const getAddressByLocation = async (lat, long) => {
// 	let URL = `adgangsadresser/reverse?x=${long}&y=${lat}&struktur=mini`
// 	let response = await dawaApi.get(URL).then(rs => rs)
// 	return response.data
// }
// /**
//  *
//  * @param {String} q Adress query
//  */
// export const getAdresses = async (q) => {
// 	let URL = `/autocomplete?q=${q}`
// 	let response = await dawaApi.get(URL).then(rs => rs)
// 	return response.data
// }
// //#region getWeather
// /**
//  *
//  * @param {int} device
//  * @param {Date} date
//  * @param {String} lang
//  */
// export const getWeather = async (device, date, lang) => {
// 	let URL = `/${moment(date).format('YYYY-MM-DDTHH:mm:ss')}/${device.lat}/${device.long}/${lang}`
// 	let response = await weatherApi.get(URL).then(rs => rs)
// 	if (response.data === 403)
// 		return null
// 	return response.data
// }

// //#endregion
// //#region GetDeviceData

// /**
//  * Get Daily Data
//  * @function
//  * @param {int} id - Data Collection ID
//  * @param {Date} from - YYYY-MM-DDTHH:mm
//  * @param {Date} to - YYYY-MM-DDTHH:mm
//  * @param {bool} raw - Raw Data
//  */
// export const getDataDaily = async (id, from, to, raw) => {
// 	let URL = raw ? `/senti/sentiwi/device/daily/raw/${id}/${from}/${to}` : `/senti/sentiwi/device/daily/${id}/${from}/${to}`
// 	let response = await api.get(URL)
// 	return response.ok ? response.data : null
// }
// /**
//  * Get Hourly Data
//  * @function
//  * @param {int} id - Data Collection ID
//  * @param {Date} from - YYYY-MM-DDTHH:mm
//  * @param {Date} to - YYYY-MM-DDTHH:mm
//  * @param {bool} raw
//  */
// export const getDataHourly = async (id, from, to, raw) => {
// 	let URL = raw ? `/senti/sentiwi/device/hourly/raw/${id}/${from}/${to}` : `/senti/sentiwi/device/hourly/${id}/${from}/${to}`
// 	let response = await api.get(URL)
// 	return response.data ? response.data : null
// }

// /**
//  * Get Minutely Data
//  * @function
//  * @param {int} id - Data Collection ID
//  * @param {Date} from - YYYY-MM-DDTHH:mm
//  * @param {Date} to - YYYY-MM-DDTHH:mm
//  * @param {bool} raw
//  */
// export const getDataMinutely = async (id, from, to, raw) => {
// 	let URL = raw ? `/senti/sentiwi/device/minutely/raw/${id}/${from}/${to}` : `/senti/sentiwi/device/minutely/${id}/${from}/${to}`
// 	let response = await api.get(URL)
// 	return response.data ? response.data : null
// }

// /**
//  * Get Summary Data
//  * @function
//  * @param {int} id - Data Collection ID
//  * @param {Date} from - YYYY-MM-DDTHH:mm
//  * @param {Date} to - YYYY-MM-DDTHH:mm
//  * @param {bool} raw
//  */
// export const getDataSummary = async (id, from, to, raw) => {
// 	let URL = raw ? `/senti/sentiwi/device/summary/raw/${id}/${from}/${to}` : `/senti/sentiwi/device/summary/${id}/${from}/${to}`
// 	let response = await api.get(URL)
// 	return response.data ? response.data : null
// }

// //#endregion

// /**
//  * Get All Pictures
//  * @param {int} deviceId
//  */
// export const getAllPictures = async (deviceId) => {
// 	var base64Flag = 'data:image/jpeg;base64,';
// 	var data = await api.get('senti/device/images/' + deviceId).then(response => {
// 		if (response.data) {
// 			var data = response.data.map(img => { return { filename: img.filename, image: base64Flag + img.image } })
// 			return data
// 		}
// 		else {
// 			return 0
// 		}
// 	})
// 	return data
// }
// /**
//  * Upload pictures
//  * @param {object} device
//  * @param {object} device.files
//  */
// export const uploadPictures = async (device) => {
// 	const form = new FormData();
// 	[...device.files].map((img, index) => form.append('sentiFile[]', device.files[index]))
// 	var config = {
// 		onUploadProgress: function (progressEvent) {

// 		}
// 	};
// 	var data = await imageApi.post('senti/device/image/' + device.id, form, config).then(rs => rs.data)
// 	return data
// }
// /**
//  * Delete an image from a device
//  * @param {int} dId Device ID
//  * @param {int} img Image ID
//  */
// export const deletePicture = async (dId, img) => {
// 	var data = await imageApi.delete('senti/device/image/' + dId + '/' + img).then(rs => {return rs.data})
// 	return data
// }
// /**
//  * Get all available devices for a specific org
//  * @param {int} orgId
//  */
// export const getAvailableDevices = async (orgId) => {
// 	let response = await api.get(`senti/datacollection/availabledevices/${orgId}`)
// 	return response.data
// }

// /**
//  * Get all Devices
//  */
// export const getAllDevices = async () => {
// 	var data = await api.get('senti/devices').then(rs => rs.data)
// 	return data ? data : []
// }
// /**
//  * Get device
//  * @param {int} id
//  */
// export const getDevice = async (id) => {
// 	var data = await api.get('senti/device/' + id).then(rs => rs.data)
// 	return data
// }

// /**
//  * Calibrate device
//  * @param {object} device
//  */
// export const calibrateDevice = async (device) => {
// 	var data = await api.post('senti/device/calibrate', device).then(rs => {
// 		return rs.ok
// 	})
// 	return data
// }

// /**
//  * Update device
//  * @param {object} device
//  * @param {int} device.id
//  */
// export const updateDevice = async (device) => {
// 	var data = await api.put(`senti/device/${device.id}`, device).then(rs => {return rs.data })
// 	return data
// }

// /**
//  * Reset Device
//  * @param {int} id
//  */
// export const resetDevice = async (id) => {
// 	var data = await api.post('/senti/resetdevice', id).then(rs => { return rs.data})
// 	return data
// }