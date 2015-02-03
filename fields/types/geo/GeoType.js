/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	super_ = require('../Type');
	
var REGEXP_LNGLAT = /^\s*(\d+(?:\.\d+)?)\s*\,\s*(\d+(?:\.\d+)?)\s*$/;

/**
 * Geo FieldType Constructor
 * @extends Field
 * @api public
 */

function geo(list, path, options) {
	
	this._fixedSize = 'medium';
	
	// TODO: implement filtering, hard-coded as disabled for now
	options.nofilter = true;
	geo.super_.call(this, list, path, options);
	
}

/*!
 * Inherit from Field
 */

util.inherits(geo, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds a 2dsphere indexed lat/lng pair
 *
 * @api public
 */

geo.prototype.addToSchema = function() {
	this.list.schema.path(this.path, { type: [Number], index: '2dsphere' });
	this.bindUnderscoreMethods();
};


/**
 * Gets the field's data from an Item, as used by the React components
 */

geo.prototype.getData = function(item) {
	var points = item.get(this.path);
	return (points && points.length === 2) ? points : [];
};


/**
 * Formats the field value
 *
 * @api public
 */

geo.prototype.format = function(item) {
	return item.get(this.path).join(', ');
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

geo.prototype.validateInput = function(data, required, item) {
	
	// Input is valid if the field is not required, and not present
	if (!this.path in data && !required) return true;
	
	var values = data[this.path];
	
	if (_.isArray(values)) {
		values = _.compact(values).join(',');
	}
	
	if (values === '' && !required) return true;
	
	return REGEXP_LNGLAT.test(values);

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

geo.prototype.updateItem = function(item, data) {
	
	if (!_.isObject(data)) return;
	
	if (this.path in data && _.isString(data[this.path])) {
		
		// Value should be formatted lng,lat
		var values = REGEXP_LNGLAT.exec(data[this.path]);
		
		if (values) {
			item.set(this.path, [values[1], values[2]]);
		} else {
			item.set(this.path, undefined);
		}
		
	} else if (this.path in data && _.isArray(data[this.path])) {
		
		var values = data[this.path];
		
		if (values.length === 2 && REGEXP_LNGLAT.test(_.compact(values).join(','))) {
			item.set(this.path, values);
		} else {
			item.set(this.path, undefined);
		}
		
	}

};


/*!
 * Export class
 */

exports = module.exports = geo;
