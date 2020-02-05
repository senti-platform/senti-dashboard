import React from 'react'
import { withStyles } from '@material-ui/core';
import { InfoCard, ItemG } from 'components';
import { Code } from 'variables/icons';
import { red, green } from '@material-ui/core/colors';
// import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import 'brace/theme/monokai';
import { useLocalization } from 'hooks';

const styles = (theme) => ({
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	},
	editor: {
		// width: 'calc(100% - 36px)', 
		border: '1px solid rgba(100, 100, 100, 0.25)',
		padding: 4,
		borderRadius: 4,
		"&:hover": {
			boder: '1px solid #000'
		}
	}
})

const FunctionCode = props => {
	const t = useLocalization()
	const { cloudfunction, classes } = props
	return (
		<InfoCard
			title={t('cloudfunctions.fields.code')}
			avatar={<Code />}
			noExpand
			content={
				<ItemG container>
					<ItemG xs={12}>
						<div className={classes.editor}>
							<AceEditor
								mode={'javascript'}
								theme={props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
								onChange={() => { }}
								value={cloudfunction.js}
								highlightActiveLine={false}
								readOnly
								showPrintMargin={false}
								style={{ width: '100%' }}
								name="UNIQUE_ID_OF_DIV"
								editorProps={{ $blockScrolling: true }}
							/>
						</div>
					</ItemG>
				</ItemG>
			} />
	)
}

export default withStyles(styles)(FunctionCode)
