sap.ui.define([
    "./BaseController",
    "../utils/custom/customProperties"
],
    function (BaseController, CustomProperties) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Main", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Main").attachMatched(this._onPatternMatched, this);
            },
            
            onAvatarPress: function (oEvent) {
                const oAvatar = oEvent.getSource();
                const oActionSheet = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.UserActions", this);
                oActionSheet.openBy(oAvatar);
            },

            onLogin: function () {
                this.getOwnerComponent().getRouter().navTo("Login");
            },

            onSignup: function () {
                this.getOwnerComponent().getRouter().navTo("Signup");
            },

            _onPatternMatched: function () {
            },
        });
    });
