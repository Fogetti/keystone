var demand = require('must');

exports.initList = function (List) {
	List.add({
		bool: { type: Boolean, note: 'This is a boolean field' },
		indented: { type: Boolean, indent: true },
		nested: {
			bool: { type: Boolean },
		},
		defaultFalse: { type: Boolean, default: false },
		defaultTrue: { type: Boolean, default: true },
		required: { type: Boolean, required: true },
		initial: { type: Boolean, initial: true },
		requiredInitial: { type: Boolean, required: true, initial: true },
		initialDefaultTrue: { type: Boolean, initial: true, default: true },
		collapse: { type: Boolean, collapse: true },
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	describe('updateItem', function () {
		it('should be true when passed the boolean true', function (done) {
			List.fields.bool.updateItem(testItem, {
				bool: true,
			}, function () {
				demand(testItem.bool).be.true();
				testItem.bool = undefined;
				done();
			});
		});

		it('should be true when passed the string "true"', function (done) {
			List.fields.bool.updateItem(testItem, {
				bool: 'true',
			}, function () {
				demand(testItem.bool).be.true();
				testItem.bool = undefined;
				done();
			});
		});

		it('should be false when passed the boolean false', function (done) {
			List.fields.bool.updateItem(testItem, {
				bool: false,
			}, function () {
				demand(testItem.bool).be.false();
				testItem.bool = undefined;
				done();
			});
		});

		it('should be false when passed the string "false"', function (done) {
			List.fields.bool.updateItem(testItem, {
				bool: 'false',
			}, function () {
				demand(testItem.bool).be.false();
				testItem.bool = undefined;
				done();
			});
		});

		it('should be false when passed undefined', function (done) {
			List.fields.bool.updateItem(testItem, {}, function () {
				demand(testItem.bool).be.false();
				testItem.bool = undefined;
				done();
			});
		});

		it('should be false when passed an empty string', function (done) {
			List.fields.bool.updateItem(testItem, {
				bool: '',
			}, function () {
				demand(testItem.bool).be.false();
				testItem.bool = undefined;
				done();
			});
		});

		it('should update nested fields', function (done) {
			List.fields['nested.bool'].updateItem(testItem, {
				nested: {
					bool: true,
				},
			}, function () {
				demand(testItem.nested.bool).be.true();
				testItem.nested.bool = undefined;
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			List.fields['nested.bool'].updateItem(testItem, {
				'nested.bool': true,
			}, function () {
				demand(testItem.nested.bool).be.true();
				testItem.nested.bool = undefined;
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate true', function (done) {
			List.fields.bool.validateInput({ bool: true }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate false', function (done) {
			List.fields.bool.validateInput({ bool: false }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate "true"', function (done) {
			List.fields.bool.validateInput({ bool: 'true' }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate "false"', function (done) {
			List.fields.bool.validateInput({ bool: 'false' }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate 0', function (done) {
			List.fields.bool.validateInput({ bool: 0 }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate 1', function (done) {
			List.fields.bool.validateInput({ bool: 1 }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.bool.validateInput({}, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate null', function (done) {
			List.fields.bool.validateInput({ bool: null }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate an empty string', function (done) {
			List.fields.bool.validateInput({ bool: '' }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate any other string input', function (done) {
			List.fields.bool.validateInput({ bool: 'abc' }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate all numerical input > 2', function (done) {
			List.fields.bool.validateInput({ bool: 2 }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.bool.validateInput({ bool: {} }, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.bool.validateInput({ bool: [] }, function (result) {
				demand(result).be(false);
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate required input === true', function (done) {
			List.fields.bool.validateRequiredInput(testItem, { bool: true }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate required input with truthy string', function (done) {
			List.fields.bool.validateRequiredInput(testItem, { bool: 'abc' }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should invalidate required input === ""', function (done) {
			List.fields.bool.validateRequiredInput(testItem, { bool: '' }, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate required input === "false"', function (done) {
			List.fields.bool.validateRequiredInput(testItem, { bool: 'false' }, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate required input === false', function (done) {
			List.fields.bool.validateRequiredInput(testItem, { bool: false }, function (result) {
				demand(result).be(false);
				done();
			});
		});
	});

	/* Deprecated inputIsValid tests */

	it('should always validate when not required', function () {
		demand(List.fields.bool.inputIsValid({ bool: 'true' }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: true }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: 'false' }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: false }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: '' }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: undefined }, false)).be(true);
	});

	it('should validate input properly when required', function () {
		demand(List.fields.bool.inputIsValid({ bool: 'true' }, true)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: true }, true)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: 'false' }, true)).be(false);
		demand(List.fields.bool.inputIsValid({ bool: false }, true)).be(false);
		demand(List.fields.bool.inputIsValid({ bool: '' }, true)).be(false);
		demand(List.fields.bool.inputIsValid({ bool: undefined }, true)).be(false);
	});
};
