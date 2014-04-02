(function(root, factory) {

    // Detect the environment of usage
    var isCJS = typeof module !== "undefined" && module.exports,
        isAMD = typeof define === 'function' && typeof define.amd === 'object' && define.amd;

    if (isCJS) {
        var _ = require("underscore");
        module.exports = factory(root, _);
    } else if (isAMD) {
        define(['underscore'], function(_) {
            return factory(root, _);
        });
    } else {
        root.Validator = factory(root, root._);
    }

})(this, function(global, _) {

    "use strict";

    var Validator = function(options)
    {
        options || (options = {});

        if (options.rules) {
            _.extend(this.rules, options.rules);
        }
    };

    Validator.prototype = (function() {

        // Common value checker
        var valueExists = function(value) {
            return !(_.isUndefined(value) || _.isNull(value));
        };

        return {
            constructor: Validator,

            validate: function(value, rules, options)
            {
                options || (options = {});

                var self = this,
                    valuesList = !_.isObject(value) ? {__single__: value} : value,
                    rulesList  = !_.isObject(value) ? {__single__: rules} : rules,
                    errorsList = {};


                _.each(rulesList, function(rules, field) {

                    var errors = errorsList[field] = [],
                        value  = _.result(valuesList, field),
                        // We pass reporting, if value is null or undefined, and required rule is set to FALSE
                        mustReport = !( valueExists(value) === false && _.has(rules, 'required') === true && _.result(rules, 'required') === false );

                    mustReport && _.each(rules, function(standard, rule) {
                        if (_.has(self.rules, rule)) {
                            if (self.rules[rule].call(self, value, standard, valuesList) === false) {
                                errors.push({
                                    value:    value,
                                    rule:     rule,
                                    standard: standard
                                });
                            }

                        } else {
                            console && console.warn("Validation rule '%s' is not exists", rule);
                        }
                    });
                });


                return !_.isObject(value) ? errorsList.__single__ : errorsList;
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

                boolean: function(value, standard)
                {
                    return typeof value == "boolean" && standard === true;
                },

                number: function(value, standard)
                {
                    var regexp = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

                    return ( typeof value == "string" && this.rules.regexp(value, regexp) == standard ) || (typeof value == "number" && standard == true);
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

                "enum": function(value, standard)
                {
                    if (standard instanceof Array) {
                        return _.indexOf(standard, value) != -1;
                    } else {
                        return false;
                    }
                },

                min: function(value, standard)
                {
                    if (!this.rules.number.call(this, value, true)) {
                        return false;
                    }

                    var number = parseInt(value, 10);

                    return number >= standard;
                },

                max: function(value, standard)
                {
                    if (!this.rules.number.call(this, value, true)) {
                        return false;
                    }

                    var number = parseInt(value, 10);

                    return number <= standard;
                },

                minlength: function(value, standard)
                {
                    if (typeof value == 'string') {
                        return value.length >= standard;
                    }

                    return false;
                },

                maxlength: function(value, standard)
                {
                    if (typeof value == 'string') {
                        return value.length <= standard;
                    }

                    return false;
                },

                required: function(value, standard)
                {
                    if (standard === true) {
                        return valueExists(value);
                    }

                    return true;
                }
            }
        }
    })();


    return Validator;
});