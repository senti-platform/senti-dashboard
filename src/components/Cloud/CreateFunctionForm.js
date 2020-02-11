import React, { useState } from 'react'
import { Button, withStyles } from '@material-ui/core';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, DSelect } from 'components'
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-monokai'
// import 'brace/mode/javascript';
// import 'brace/theme/tomorrow';
// import 'brace/theme/monokai';

//@Andrei
const CreateFunctionForm = props => {
	// const [filters, setFilters] = useState({
	// 	keyword: ''
	// })
	const [openOrg, setOpenOrg] = useState(false)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		filters: {
	// 			keyword: ''
	// 		},
	// 		openOrg: false
	// 	}
	// }

	// const handleFilterKeyword = value => {
	// 	setFilters({ keyword: value })
	// 	// this.setState({
	// 	// 	filters: {
	// 	// 		keyword: value
	// 	// 	}
	// 	// })
	// }

	const renderType = () => {
		const { t, cloudfunction, handleChange } = props
		return <DSelect
			margin={'normal'}
			label={t('cloudfunctions.fields.type')}
			value={cloudfunction.type}
			onChange={handleChange('type')}
			menuItems={[
				{ value: 0, label: t('cloudfunctions.fields.types.function') },
				// { value: 1, label: t('cloudfunctions.fields.types.external') },
			]}
		/>
	}

	const { t, handleChange, org, cloudfunction, handleOrgChange, classes, handleCreate, handleCodeChange, goToRegistries } = props
	return (
		<GridContainer>
			<Paper className={classes.paper}>
				<form className={classes.form}>
					<Grid container>
						<ItemGrid xs={12}>
							<TextF
								id={'functionName'}
								label={t('collections.fields.name')}
								onChange={handleChange('name')}
								value={cloudfunction.name}
								autoFocus
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								id={'functionDesc'}
								label={t('collections.fields.description')}
								onChange={handleChange('description')}
								value={cloudfunction.description}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							{renderType()}
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								id={'cfOrgId'}
								value={org.name}
								onClick={() => setOpenOrg(true)}
								readonly
							/>
							<AssignOrgDialog
								t={t}
								open={openOrg}
								handleClose={() => setOpenOrg(false)}
								callBack={org => { setOpenOrg(false); handleOrgChange(org) }}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							{cloudfunction.type === 0 ?
								<div className={classes.editor}>
									<AceEditor
										mode={'javascript'}
										theme={props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
										onChange={handleCodeChange('js')}
										value={cloudfunction.js}
										showPrintMargin={false}
										style={{ width: '100%' }}
										name="createCloudFunction"
										editorProps={{ $blockScrolling: true }}
									/>
								</div> : null
							}
						</ItemGrid>
						<ItemGrid container style={{ margin: 16 }}>
							<div className={classes.wrapper}>
								<Button
									variant='outlined'
									onClick={goToRegistries}
									className={classes.redButton}
								>
									{t('actions.cancel')}
								</Button>
							</div>
							<div className={classes.wrapper}>
								<Button onClick={handleCreate} variant={'outlined'} color={'primary'}>
									{t('actions.save')}
								</Button>
							</div>
						</ItemGrid>

					</Grid>
				</form>
			</Paper>
		</GridContainer>
	)
}


export default withStyles(createprojectStyles, { withTheme: true })(CreateFunctionForm)