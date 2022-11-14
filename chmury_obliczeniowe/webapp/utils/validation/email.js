sap.ui.define([], function() {
	"use strict";
	return {
        _REGEX: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

        validate: function(sEmail) {
            return this._REGEX.test(sEmail); 
        }
	};
});