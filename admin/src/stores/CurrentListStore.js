var Store = require('store-prototype');
var utils = require('../utils');
var xhr = require('xhr');

var _list = Keystone.list;
var _ready = false;
var _loading = false;
var _items = {};

var available = {
	columns: _list.uiElements.map((col,i) => {
		return {
			type: col.type === 'heading' ? 'header' : 'item',
			label: col.type === 'heading' ? col.content : utils.titlecase(col.field)
		};
	}),
	filters: []
};

var active = {
	columns: Keystone.columns,
	filters: []
};

function getFilters () {
	var filters = {};
	active.filters.forEach((filter) => {
		filters[filter.field.path] = filter.value;
	});
	return filters;
}

function buildQueryString () {
	var queryFilters = active.filters.length ? JSON.stringify(getFilters()) : '';
	return '?filters=' + queryFilters;
}

var CurrentListStore = new Store({
	getList () {
		return _list;
	},
	getActiveColumns () {
		return active.columns;
	},
	getAvailableColumns () {
		return available.columns;
	},
	getActiveFilters () {
		return active.filters;
	},
	getAvailableFilters () {
		return available.filters;
	},
	addFilter (filter) {
		active.filters.push(filter);
		this.loadItems();
		this.notifyChange();
	},
	removeFilter (filter) {
		active.filters.splice(active.filters.indexOf(filter), 1);
		this.loadItems();
		this.notifyChange();
	},
	isLoading () {
		return _loading;
	},
	isReady () {
		return _ready;
	},
	loadItems () {
		_loading = true;
		var url = '/keystone/api/' + _list.path + buildQueryString();
		console.log(url);
		xhr({
		    url: url
		}, (err, resp, body) => {
		    // check resp.statusCode
			_loading = false;
			try {
				body = JSON.parse(body);
			} catch(e) {
				console.log('Error parsing results json:', e, body);
				return;
			}
			_ready = true;
			_items = body;
			this.notifyChange();
		})
	},
	getItems () {
		return _items;
	}
});

module.exports = CurrentListStore;
