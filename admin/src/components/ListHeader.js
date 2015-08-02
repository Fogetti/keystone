var React = require('react');
var classNames = require('classnames');
var utils = require('../utils.js');

var CurrentListStore = require('../stores/CurrentListStore');

var ListFilters = require('./ListFilters');
var ListFiltersAdd = require('./ListFiltersAdd');

var { Button, Dropdown, FormInput, InputGroup, Pagination } = require('elemental');

var ListHeader = React.createClass({

	displayName: 'ListHeader',

	getInitialState () {
		return {
			searchString: ''
		};
	},

	handleSearch (e) {
		this.setState({
			searchString: e.target.value
		});
	},

	handleSearchClear (e) {
		this.setState({
			searchString: ''
		});
		React.findDOMNode(this.refs.listSearchInput).focus();
	},

	handleFilterSelect (selected) {
		console.log('Filter selected: ', selected);
	},

	handleColumnSelect (selected) {
		console.log('Column selected: ', selected);
	},

	handleSortSelect (selected) {
		console.log('Sort selected: ', utils.camelcase(selected));
	},

	handlePageSelect (selected) {
		var pagination = Keystone.items;
		var page = selected.target.innerText;

		// TODO: fix me
		if (page === '...') {
			page = (pagination.next ? pagination.totalPages : 1);
		}

		location.href = '/keystone/' + Keystone.list.path + '/' + page;
	},

	renderTitle () {
		var sort = Keystone.sort ? <span className="text-muted"> sorted by {Keystone.sort}</span> : null;
		return (
			<h2 className="ListHeader__title">
				{utils.plural(Keystone.items.total, ('* ' + Keystone.list.singular), ('* ' + Keystone.list.plural))}
				{sort}
			</h2>
		);
	},

	renderSearch () {
		var searchClearIcon = classNames('ListHeader__searchbar-field__icon octicon', {
			'is-search octicon-search': !this.state.searchString.length,
			'is-clear octicon-x': this.state.searchString.length
		});
		return (
			<InputGroup.Section grow className="ListHeader__searchbar-field">
				<FormInput ref="listSearchInput" value={this.state.searchString} onChange={this.handleSearch} placeholder="Search" className="ListHeader__searchbar-input" />
				<button ref="listSearchClear" type="button" onClick={this.handleSearchClear} disabled={!this.state.searchString.length} className={searchClearIcon} />
			</InputGroup.Section>
		);
	},

	renderColumnsButton () {
		return (
			<InputGroup.Section>
				<Dropdown alignRight items={CurrentListStore.getAvailableColumns()} onSelect={this.handleColumnSelect}>
					<Button>
						Columns
						<span className="disclosure-arrow" />
					</Button>
				</Dropdown>
			</InputGroup.Section>
		);
	},

	renderSortButton () {
		return (
			<InputGroup.Section>
				<Dropdown alignRight items={CurrentListStore.getAvailableColumns()} onSelect={this.handleSortSelect}>
					<Button>
						Sort
						<span className="disclosure-arrow" />
					</Button>
				</Dropdown>
			</InputGroup.Section>
		);
	},

	render () {
		return (
			<div className="ListHeader">
				<div className="container">
					{this.renderTitle()}
					<InputGroup contiguous={false} className="ListHeader__searchbar">
						{this.renderSearch()}
						<ListFiltersAdd key="listFilters__add" />
						{this.renderColumnsButton()}
						{this.renderSortButton()}
					</InputGroup>
					<ListFilters filters={CurrentListStore.getActiveFilters()} />
					<Pagination pagination={Keystone.items} onClick={this.handlePageSelect} className="ListHeader__pagination" />
				</div>
			</div>
		);
	}

});

module.exports = ListHeader;
