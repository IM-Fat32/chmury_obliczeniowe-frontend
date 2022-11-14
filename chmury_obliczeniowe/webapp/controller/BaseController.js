sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History) {
        "use strict";

        return Controller.extend("chm.obl.chmuryobliczeniowe.controller.BaseController", {
            onInit: function () {

            },

            onNavBack: function () {
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                    return;
                }
                this.getOwnerComponent().getRouter().navTo("Main" /*no history*/);
            },

            getI18nText: function(sTextName) {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextName);
            },

            onShowPassword: function (oEvent) {
                const oInput = oEvent.getSource();
                if (oInput.getType() === "Password") {
                    oInput.setType("Text");
                    return;
                }
                oInput.setType("Password");
            },

            setShowPasswordEvents: function (oEventControl) {
                oEventControl._getValueHelpIcon().attachBrowserEvent("mousedown", function (oEventControl) {
                    oEventControl.setType("Text");
                }.bind(this, oEventControl));

                oEventControl._getValueHelpIcon().attachBrowserEvent("mouseup mouseleave", function (oEventControl) {
                    oEventControl.setType("Password");
                }.bind(this, oEventControl));
            }
        });
    });
