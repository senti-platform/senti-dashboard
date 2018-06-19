import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Projects from 'views/Projects/Projects';
import CreateProject from 'components/Project/CreateProject';

export default withRouter((props) => {
	return (
		<Switch>
			<Route path={'/projects/new'} component={() => <CreateProject setHeader={props.setHeader} />}/>
			<Route path={'/projects'} render={() => <Projects setHeader={props.setHeader}/>} />
		</Switch>
	)
})
