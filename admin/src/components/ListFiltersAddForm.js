var React = require('react');
var classNames = require('classnames');

var filters = require('../filters');
var Popout = require('./Popout');

var { Button } = require('elemental');

var ListFiltersAddForm = React.createClass({

	propTypes: {
		field: React.PropTypes.object.isRequired,
		onApply: React.PropTypes.func,
		onCancel: React.PropTypes.func
	},

	getInitialState () {
		var filterComponent = filters[this.props.field.type];
		var filterValue = filterComponent && filterComponent.getDefaultValue ? filterComponent.getDefaultValue() : {};
		return {
			filterComponent: filterComponent,
			filterValue: filterValue
		};
	},
	
	componentDidMount () {
		let footer = React.findDOMNode(this.refs.footer);
		let body = React.findDOMNode(this.refs.body);
		
		this.setState({
			bodyHeight: body.scrollHeight > this.props.maxHeight ? (body.offsetHeight - footer.offsetHeight) : 'auto'
		});
	},
	
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue
		});
	},

	handleFormSubmit (e) {
		e.preventDefault();
		this.props.onApply(this.state.filterValue);
	},

	renderInvalidFilter () {
		return (
			<div>Error: type {this.props.field.type} has no filter UI.</div>
		);
	},

	render () {
		var FilterComponent = this.state.filterComponent;
		return (
			<form onSubmit={this.handleFormSubmit}>
				<Popout.Body ref="body" scrollable style={{ height: this.state.bodyHeight }}>
					{FilterComponent ? <FilterComponent field={this.props.field} filter={this.state.filterValue} onChange={this.updateValue} /> : this.renderInvalidFilter()}
				</Popout.Body>
				<Popout.Footer
					ref="footer" 
					primaryButtonIsSubmit
					primaryButtonLabel="Apply"
					secondaryButtonAction={this.props.onCancel}
					secondaryButtonLabel="Cancel" />
			</form>
		);
	}

});

module.exports = ListFiltersAddForm;
