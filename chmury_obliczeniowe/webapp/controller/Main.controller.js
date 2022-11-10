sap.ui.define([
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Main", {
            onInit: function () {

            },

            onAvatarPress: function(event) {
                const oAvatar = event.getSource();
                const oActionSheet = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.UserActions", this);
                oActionSheet.openBy(oAvatar);
            },

            onLogin: function() {
                this.getOwnerComponent().getRouter().navTo("Login");
            },

            onSignup: function() {
                this.getOwnerComponent().getRouter().navTo("Signup");
            },
        });
    });
