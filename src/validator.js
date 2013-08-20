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

    Validator.REQUIRED = 'required';

    Validator.prototype = {
        constructor: Validator,

        validate: function(value, rules, options)
        {
            options || (options = {});

            var self = this,
                errors = [];

            if (!(_.isNull(value) && _.has(rules, self.constructor.REQUIRED) && rules[self.constructor.REQUIRED] === false)) {
                _.each(rules, function(standard, rule) {
                    if (_.has(self.rules, rule)) {
                        if (self.rules[rule].call(self, value, standard) === false) {

                            var error = {
                                value:    value,
                                rule:     rule,
                                standard: standard
                            };

                            errors.push(error);
                        }
                    } else {
                        console.warn("Validation rule '%s' is not exists", rule);
                    }
                });
            }

            return errors;
        },

        rules: {
            email: function(value, standard)
            {
                var regexp = new RegExp("^[a-z0-9._%-]+@[a-z0-9.-]*[a-z0-9]{1}\.[a-z]{2,4}$", "i");
                return this.rules.regexp(value, regexp) == standard;
            },

            russians: function(value, standard)
            {
                var regexp = /^[А-Яа-яёЁ\W]$/i;
                return this.rules.regexp(value, regexp) == standard;
            },

            string: function(value, standard)
            {
                var regexp = /^([^\"\\]*|\\(["\\\/bfnrt]{1}|u[a-f0-9]{4}))*$/;

                return typeof value == "string" && this.rules.regexp(value, regexp) == standard;
            },

            number: function(value, standard)
            {
                var regexp = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;

                return ( typeof value == "string" && this.rules.regexp(value, regexp) == standard ) || typeof value == "number";
            },

            regexp: function(value, standard)
            {
                var regexp = standard instanceof RegExp ? standard : new RegExp(standard);

                if (typeof value == 'string') {
                    return regexp.test(value);
                } else {
                    return false;
                }
            },

            enum: function(value, standard)
            {
                if (standard instanceof Array) {
                    return standard.indexOf(value) != -1;
                } else {
                    return false;
                }
            },

            min: function(value, standard)
            {
                if (typeof value == 'string') {
                    return this.minlength(value, standard);
                }

                if (typeof value == 'number') {
                    return value >= standard;
                }

                return false;
            },

            max: function(value, standard)
            {
                if (typeof value == 'string') {
                    return this.maxlength(value, standard);
                }

                if (typeof value == 'number') {
                    return value <= standard;
                }

                return false;
            },

            minlength: function(value, standard)
            {
                if (typeof value == 'string') {
                    return value.length >= standard;
                } else {
                    return false;
                }
            },

            maxlength: function(value, standard)
            {
                if (typeof value == 'string') {
                    return value.length <= standard;
                } else {
                    return false;
                }
            },

            required: function(value, standard)
            {
                return standard === true ? !!value === standard : true;
            }
        }
    };

    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        module.exports = Validator;
    } else {
        if ( typeof define === "function" && define.amd ) {
            define(function(){ return Validator; });
        }

        global.Validator = Validator;
    }


}).call(this, _);