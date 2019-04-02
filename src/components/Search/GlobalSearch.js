import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
// import match from 'autosuggest-highlight/match';
// import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import GlobalSearchInput from './GlobalSearchInput';
// import { ClickAwayListener } from '@material-ui/core';
import withLocalization from 'components/Localization/T';
import { connect } from 'react-redux'
import { changeEH } from 'redux/appState';
import globalSearchStyles from 'assets/jss/components/search/globalSearchStyles';
import { setSearchValue } from 'redux/globalSearch';
import { hist } from 'App';
import { T, ItemG } from 'components';
// import { Typography } from '@material-ui/core';

function renderInput(inputProps) {
	return (
		<GlobalSearchInput {...inputProps} />
	);
}


function renderSuggestionsContainer(options) {
	const { containerProps, children } = options;
	return (
		<Paper {...containerProps}>
			{children}
		</Paper>
	);
}

function getSuggestionValue(suggestion) {
	return suggestion.label;
}

function getSuggestions(value, suggestions) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	// let count = 0;
	return inputLength === 0 ? []
		: suggestions.map(section => {
			return {
				title: section.title,
				suggestions: section.suggestions.filter(l => {
					let keep2 = false 
					l.values.forEach(v => {
						if (v.value.toLowerCase().slice(0, inputLength) === inputValue) {
							keep2 = true
						}
					})
					if (keep2 === true) {
						keep2 = false
						return true
					}
					else {
						return false
					}
				})
			};
		})
			.filter(section => section.suggestions.length > 0);
	// return inputLength === 0 ? []
	// 	: suggestions.filter(section => {
	// 		let keep2 = false 
	// 		// console.log(section)
	// 		section.suggestions.forEach(k => {
	// 			k.values.forEach(l => {
	// 				if (l.toLowerCase().slice(0, inputLength) === inputValue) {
	// 					keep2 = true
	// 				}
	// 			})
	// 		});
	// 		const keep = count < 5 && keep2
	// 		console.log(keep, keep2)
	// 		if (keep) {
	// 			count += 1;
	// 		}

	// 		return keep;
	// 	});
}

class GlobalSearch extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			value: '',
			suggestions: [],
			open: false
		}
		this.inputRef = React.createRef()

	}
	componentDidMount() {
		if (this.props.focusOnMount && this.inputRef.current)
			this.focusInput()
	}

	handleResetSearch = () => {
		this.handleChange(null, { newValue: '' })
	}
	renderSectionTitle = (section) => {
		const { t } = this.props
		return (
			<MenuItem divider>
		  		<T style={{ margin: 8 }}>{t(`${section.title}`)}</T>
			</MenuItem>
		);
	}

	highlightParts = (values, query) => {
		let matches = []
		values.forEach(v => {
			if (v.value.includes(query)) {
				matches.push(v)
			}
		})
		return matches
	}
	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const { t } = this.props
		// console.log(query)
		// const matches = match(suggestion.values.map(v => v.value).join(', '), query);
		// const matches = match(suggestion.label, query);
		// console.log(this.highlightParts(suggestion.values, query))
		// const parts = parse(suggestion.values.map(v => v.value).join(', '), matches);
		// console.log(matches, parts)
		// console.log(suggestion)
		let matches = this.highlightParts(suggestion.values, query)
		return (
			<MenuItem selected={isHighlighted} component='div' style={{ height: 'auto' }} onClick={() => hist.push(suggestion.path)}>
				<ItemG container>
					<div style={{ padding: 24 }}>
						{t(`sidebar.${suggestion.type}`)}
						{/* {parts.map((part, index) => {
							return part.highlight ? (
								<span key={String(index)} style={{ fontWeight: 300, maxWidth: 'calc(100vw-100px)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
									{part.text}
								</span>
							) : (
								<strong key={String(index)} style={{ fontWeight: 500 }}>
									{part.text}
								</strong>
							);
						})} */}
					</div>
					<ItemG>
						<div style={{ margin: 8, width: 1, height: '90%', background: '#c5c5c5' }}/>
					</ItemG>
					<ItemG style={{ width: 'auto' }}>
						<div style={{   maxWidth: 300,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",  }}>
							<T noWrap variant={'h6'}>{suggestion.label}</T>
						</div>
						<div style={{   maxWidth: 300,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",  }}>
							{matches.map((m, i) => {
								return <span>
									{`${t(`${suggestion.type}s.fields.${m.field}`)}: ${m.value}${matches.length > 0 && i !== matches.length - 1 ? ', ' : ''} `}
								</span>
							})}
							{/* {parts.map((part, index) => {
									return part.highlight ? (
										<span key={String(index)} style={{ fontWeight: 300, maxWidth: 'calc(100vw-100px)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
											{part.text}
										</span>
									) : null
								
								})} */}
						</div>
					</ItemG>
				</ItemG>
			</MenuItem>
		);
	}

	handleSuggestionsFetchRequested = ({ value, reason }) => {
		const { open } = this.state
		const { searchValue } = this.props
		if (open && searchValue === '' && reason === 'escape-pressed') {
			this.handleClose()
		}
		this.setState({
			suggestions: getSuggestions(value, this.props.suggestions),
		})
	}

	handleSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		})
	}

	handleChange = (event, { newValue }) => {
		this.props.setSearchVal(newValue)
	}

	focusInput = () => {
		if (this.state.open || this.props.open)
			this.inputRef.current.focus()
	}

	handleOpen = () => {
		if (this.props.open === undefined)
			this.setState({ open: !this.state.open }, this.focusInput)
	}

	handleClose = () => {
		if (this.props.open === undefined)
			this.setState({ open: false })
	}
	getSectionSuggestions = (section) => {
		return section.suggestions;
	  }
	  
	render() {
		const { classes, right } = this.props;
		return (
			<Autosuggest
				theme={{
					container: classes.autosuggestContainer + ' ' + (right ? classes.right : ''),
					suggestionsContainerOpen: classes.suggestionsContainerOpen,
					suggestionsList: classes.suggestionsList,
					suggestion: classes.suggestion,
				}}
				multiSection={true}
				alwaysRenderSuggestions={true}
				focusInputOnSuggestionClick={false}
				renderInputComponent={renderInput}
				suggestions={this.state.suggestions}
				onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
				// onSuggestionSelected={this.focusInput}
				renderSuggestionsContainer={renderSuggestionsContainer}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={this.renderSuggestion}
				renderSectionTitle={this.renderSectionTitle}
				getSectionSuggestions={this.getSectionSuggestions}
				onFocus={this.props.disableEH}
				onBlur={this.props.enableEH}
				inputProps={{
					onFocus: this.props.disableEH,
					onBlur: this.props.enableEH,
					noAbsolute: this.props.noAbsolute,
					placeholder: this.props.t('actions.src'),
					classes,
					fullWidth: this.props.fullWidth,
					value: this.props.searchValue,
					onChange: this.handleChange,
					reference: this.inputRef,
					open: this.state.open || this.props.open,
					handleOpen: this.handleOpen,
					handleClose: this.handleClose,
					handleResetSearch: this.handleResetSearch,
					t: this.props.t
				}}
			/>
			// </ClickAwayListener>
			// </div>
		);
	}
}

GlobalSearch.propTypes = {
	classes: PropTypes.object.isRequired,
	searchValue: PropTypes.string,
	t: PropTypes.func.isRequired,
	suggestions: PropTypes.array.isRequired,
	handleFilterKeyword: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
	searchValue: state.globalSearch.searchVal,
	suggestions: state.globalSearch.suggestions
})

const mapDispatchToProps = dispatch => ({
	disableEH: () => dispatch(changeEH(false)),
	enableEH: () => dispatch(changeEH(true)),
	setSearchVal: val => dispatch(setSearchValue(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(globalSearchStyles)(GlobalSearch)));