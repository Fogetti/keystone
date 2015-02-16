var assert = require('assert'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler'),
	HtmlType = require('../HtmlType');

exports.initList = function(List) {
	List.add({
		html: { type: HtmlType },
		nested: {
			html: { type: HtmlType }
		}
	});
};

exports.createData = function(List) {

};

exports.testFilters = function(List) {

};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.html.updateItem(testItem, {
			html: 'foobar'
		});
		demand(testItem.html).be('foobar');
		testItem.html = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.html'].updateItem(testItem, {
			nested: {
				html: 'foobar'
			}
		});
		demand(testItem.nested.html).be('foobar');
		testItem.nested.html = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.html'].updateItem(testItem, {
			'nested.html': 'foobar'
		});
		demand(testItem.nested.html).be('foobar');
		testItem.nested.html = undefined;
	});
};
