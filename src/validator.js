(function(_) {

	"use strict";

	var global = this;

	var Validator = function(options)
	{
		options || (options = {});

		if (options.rules) {
			_.extend(this.rules, options.rules);
		}
	};

	Validator.prototype = {
		validate: function(value, rules, options)
		{
			options || (options = {});

			var self = this,
                errors = [];

            _.each(rules, function(standard, rule) {
                if (_.has(self.rules, rule)) {
                    if (self.rules[rule].call(this, value, rules[rule]) === false) {

                        var error = {
                            value:    value,
                            rule:     rule,
                            standard: rules[rule]
                        };

                        errors.push(error);
                    }
                } else {
                    console.warn("Validation rule '%s' is not exists", rule);
                }
            });

			return errors;
		},

		rules: {
			email: function(value, option)
			{
				var regexp = new RegExp("^[a-z0-9._%-]+@[a-z0-9.-]*[a-z0-9]{1}\.[a-z]{2,4}$", "i");
				return this.validators.preg(value, regexp) == option;
			},

			russians: function(value, option)
			{
				var regexp = /^[А-Яа-яёЁ\W]$/i;
				return this.validators.preg(value, regexp) == option;
			},

			regexp: function(value, option)
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
	};

    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        module.exports = Validator;
    } else {
        if ( typeof define === "function" && define.amd ) {
            define([], function () { return Validator; } );
        } else {
            global.Validator = Validator;
        }
    }


}).call(this, _);