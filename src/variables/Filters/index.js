import { filterItems } from 'variables/functions';
import moment from 'moment'
const _ = require('lodash')
const index = (obj, is, value) => {
	let newA = _.get(obj, is) !== undefined ? _.get(obj, is) : undefined
	return newA
}
const filterByDate = (items, k) => {
	return items = items.reduce((newArr, d) => {
		let objVal = index(d, k.key)
		if (objVal)
			if (k.value.after) {
				if (moment(objVal).isAfter(moment(k.value.date)))
					newArr.push(d)
			}
			else {
				if (moment(objVal).isBefore(moment(k.value.date)))
					newArr.push(d)
			}
		return newArr
	}, [])
}
const filterByString = (items, k) => {
	if (k.key === "") {
		return items = filterItems(items, { keyword: k.value })
	}
	else
		return items = items.reduce((newArr, d) => {
			let objVal = index(d, k.key)
			if (objVal !== null && objVal !== undefined) {
				if (objVal.toString().toLowerCase().includes(k.value.toString().toLowerCase()))
					newArr.push(d)
				else {
					if (objVal.hasOwnProperty(k.value)) {
						newArr.push(d)
					}
				}
			}

			return newArr
		}, [])
}
const filterByDiff = (items, k) => {
	items = items.reduce((newArr, d) => {
		let objVal = index(d, k.key)
		if (k.value.diff) {
			if (k.value.values.false.indexOf(objVal) === -1)
				newArr.push(d)
		}
		else {
			if (k.value.values.false.indexOf(objVal) !== -1)
				newArr.push(d)
		}
		return newArr
	}, [])
	return items
}
// export const customFilterItems = (items, keyValues) => {
// 	keyValues.forEach(k => {
// 		switch (k.type) {
// 			case 'string':
// 			case 'dropDown':
// 			case null:
// 				items = filterByString(items, k)
// 				break;
// 			case 'date':
// 				items = filterByDate(items, k)
// 				break;
// 			case 'diff':
// 				items = filterByDiff(items, k)
// 				break;
// 			default:
// 				break;
// 		}
// 	})
// 	return items
// }
export const customFilterItems = (itm, keyValues) => {
	let ORItems = null
	let items = itm
	const filterItem = (k, items) => {
		switch (k.type) {
			case 'string':
			case 'dropDown':
			case null:
				return filterByString(items, k)
			case 'date':
				return filterByDate(items, k)
			case 'diff':
				return filterByDiff(items, k)
			default:
				break
		}
	}
	keyValues.forEach(k => {
		if (k.filterType === 'OR') {
			ORItems = items
			let filtered = filterItem(k, itm)
			items = [...ORItems, ...filtered]
			items = items.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
		}
		if (k.filterType === 'AND') {
			items = filterItem(k, items)
		}
	})
	return items
}