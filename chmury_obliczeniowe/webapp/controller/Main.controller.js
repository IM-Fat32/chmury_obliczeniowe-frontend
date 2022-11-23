sap.ui.define([
    "./BaseController",
    "../utils/custom/customProperties",
    "../utils/constants/NAMES",
    "../utils/dialogs/busy",
    "../utils/dialogs/error",
],
    function (
        BaseController,
        CustomProperties,
        NAMES,
        BusyDialog,
        ErrorDialog
    ) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Main", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Main").attachMatched(this._onPatternMatched, this);
            },

            onOpenClientsView: function() {
                this.getOwnerComponent().getRouter().navTo("Clients");
            },

            onOpenServicesView: function() {
                this.getOwnerComponent().getRouter().navTo("Services");
            },

            onOpenDevicesView: function() {
                this.getOwnerComponent().getRouter().navTo("Devices");
            },

            _onPatternMatched: function () {
                const oAuthModel = this.getOwnerComponent().getModel(NAMES.getModels().authModel);

                if (!oAuthModel.getProperty("/isUserAuth"))
                    this.getOwnerComponent().getRouter().navTo("Login");
            },
        });
    });
