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
                this.getOwnerComponent().getRouter().navTo("Main", {}, true /*no history*/);
            }

        });
    });
