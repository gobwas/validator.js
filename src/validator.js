(function(_) {

	'use strict';

	var global = this;

	var Validator = function(options)
	{
		var options = options || {};

		if (options.rules) {
			_.extend(this.rules, options.rules);
		}
	};

	_.extend(Validator.prototype, {
		validate: function(value, rules, options)
		{
			options = options || {};

			var errors = [];

			for (var rule in rules) {
				if (this.rules.hasOwnProperty(rule)) {
					if (this.rules[rule].call(this, value, rules[rule]) === false) {

						var error = {
							value:    value,
							rule:     rule,
							standard: rules[rule]
						};

						errors.push(error);
					}
				} else {
					console.warn("Not existing validation rule:", rule);
				}
			}

			return errors;
		},

		rules: {
			email: function(value, option)
			{
				var regexp = new RegExp("^[A-Z0-9._%-]+@[A-Z0-9.-]+((?<!\.)\.)[A-Z]{2,4}$", "i");
				return this.validators.preg(value, regexp) == option;
			},

			russians: function(value, option)
			{
				var regexp = /^[А-Яа-яёЁ\W]$/i;
				return this.validators.preg(value, regexp) == option;
			},

			preg: function(value, option)
			{
				if (option instanceof RegExp &&  typeof value == 'string') {
					return option.test(value);
				} else {
					return false;
				}
			},

			enum: function(value, option)
			{
				if (option instanceof Array) {
					return option.indexOf(value) != -1;
				} else {
					return false;
				}
			},

			min: function(value, option)
			{
				if (typeof value == 'string') {
					return value.length >= option;
				} else if (typeof value == 'number') {
					return value >= option;
				} else {
					return false;
				}
			},

			max: function(value, option)
			{
				if (typeof value == 'string') {
					return value.length <= option;
				} else if (typeof value == 'number') {
					return value <= option;
				} else {
					return false;
				}
			},

			required: function(value, option)
			{
				return !!value === option;
			}
		}
	});

	global.Validator = Validator;

}).call(this, _);