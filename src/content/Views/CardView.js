import React, { Component } from 'react'
import { CardsContainer } from './ViewStyles'
import CardItem from './Components/CardView/Card/CardItem'

export default class CardView extends Component {
	constructor(props) {
		super(props)

		this.state = {
			pageOfItems: [],
		}
	}


	activeColumnSorting = (col) => {
		return col === this.props.sortColumn ? true : false
	}
	render() {

		return (

			this.props.items.length !== 0 ?
				<CardsContainer pageSize={this.props.pageSize}>
					{this.props.items.map((c, i) =>
						<CardItem
							key={i}
							item={c}
							column={this.props.columns}
						/>
					)}</CardsContainer>
				:
				<div>No Items</div>

		)
	}
}