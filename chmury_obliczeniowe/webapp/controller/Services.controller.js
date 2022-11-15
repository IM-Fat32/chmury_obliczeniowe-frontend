sap.ui.define([
    "./BaseController",
    "../utils/constants/NAMES",
    "../utils/custom/customProperties",
    "../utils/dialogs/error",
    "../utils/dialogs/success",
    "../utils/dialogs/busy",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     */
    function (
        BaseController,
        NAMES,
        CustomProperties,
        ErrorDialog,
        SuccessDialog,
        BusyDialog
    ) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Services", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Login").attachMatched(this._onPatternMatched, this);
            },

            _onPatternMatched: function () {

            }
        });
    });
