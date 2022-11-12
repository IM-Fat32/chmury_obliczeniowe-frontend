sap.ui.define([
    "./BaseController",
    "../utils/constants/NAMES"
],
    function (BaseController, NAMES) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Login", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Login").attachMatched(this._onPatternMatched, this);
            },

            onLoginValueChange: function (oEvent) {
                const oLoginViewModel = this.getOwnerComponent().getModel(NAMES.getModels().loginViewModel);
                const oInput = oEvent.getSource();
                const sPath = oInput.getFieldGroupIds()[0];

                oLoginViewModel.setProperty(`/${sPath}`, oInput.getValue().length > 0 ? true : false);
            },

            _onPatternMatched: function() {
                const oLoginViewModel = this.getOwnerComponent().getModel(NAMES.getModels().loginViewModel);
                oLoginViewModel.setProperty("/isLoginFilled", false);
                oLoginViewModel.setProperty("/isPasswordFilled", false);
                oLoginViewModel.setProperty("/userPawssword", "");
                oLoginViewModel.setProperty("/userLogin", "");
            }
        });
    });
