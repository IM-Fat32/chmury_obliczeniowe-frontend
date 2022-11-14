sap.ui.define([], function () {
    "use strict";
    return {
        _models: {
            loginViewModel: "loginViewModel",
            signupViewModel: "signupViewModel",
            authModel: "authModel",
        },

        getModels: function () {
            return this._models;
        }
    };
});