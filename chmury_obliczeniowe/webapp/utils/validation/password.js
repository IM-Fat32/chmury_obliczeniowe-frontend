sap.ui.define([], function () {
    "use strict";
    return {
        validate: function(sPassword) {
            return sPassword.length >= 6;
        }
    };
});