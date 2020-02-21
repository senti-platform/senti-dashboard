import React from 'react'
import { Route } from 'react-router-dom'
import Management from 'views/Management/Management'

const management = (props) => {
	return <Route path={'/management'}><Management {...props} /></Route>
}

export default management