import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { FormField, FormInput, FormSelect, SegmentedControl } from 'elemental';

const MODE_OPTIONS = [
	{ label: 'Exactly',     value: 'exactly' },
	{ label: 'Contains',    value: 'contains' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with',   value: 'endsWith' }
];

var TextFilter = React.createClass({

	getInitialState () {
		return {
			modeValue: MODE_OPTIONS[0].value, // 'exactly'
			modeLabel: MODE_OPTIONS[0].label, // 'Exactly'
			inverted: false,
			value: ''
		};
	},

	componentDidMount () {
		// focus the text focusTarget
		React.findDOMNode(this.refs.focusTarget).focus();
	},

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},

	selectMode (mode) {
		// TODO: implement w/o underscore
		this.setState({
			modeValue: mode,
			modeLabel: _.findWhere(MODE_OPTIONS, { value: mode }).label
		});

		// focus the text input after a mode selection is made
		React.findDOMNode(this.refs.focusTarget).focus();
	},

	renderToggle () {
		let options = [
			{ label: 'Matches', value: false },
			{ label: 'Does NOT Match', value: true }
		];

		return <SegmentedControl equalWidthSegments type="primary" options={options} value={this.state.inverted} onChange={this.toggleInverted} />;
	},

	render () {
		let { field } = this.props;
		let { modeLabel, modeValue } = this.state;

		let placeholder = field.label + ' ' + modeLabel.toLowerCase() + '...';

		return (
			<div>
				{this.renderToggle()}
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={modeValue} />
				<FormField>
					<FormInput ref="focusTarget" placeholder={placeholder} />
				</FormField>
			</div>
		);
	}

});

module.exports = TextFilter;
