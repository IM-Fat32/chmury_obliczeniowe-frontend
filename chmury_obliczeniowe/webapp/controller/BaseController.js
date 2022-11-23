sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "../utils/dialogs/busy",
    "../utils/dialogs/error",
    "../utils/constants/NAMES",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        Controller,
        History,
        BusyDialog,
        ErrorDialog,
        NAMES
    ) {
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

            getI18nText: function (sTextName) {
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
            },

            onCloseDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },

            onAvatarPress: function (oEvent) {
                const oAvatar = oEvent.getSource();
                const oActionSheet = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.UserActions", this);
                this.getView().addDependent(oActionSheet);
                oActionSheet.openBy(oAvatar);
            },

            onLogout: function () {
                BusyDialog.open(this, "Wylogowywanie..");
                firebase.auth().signOut().then(() => {
                    this._setLoggedUserData();
                    BusyDialog.close(this);
                    this.getOwnerComponent().getRouter().navTo("Login");
                }).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, oError.message);
                });
            },

            _setLoggedUserData: function () {
                const oAuthModel = this.getOwnerComponent().getModel(NAMES.getModels().authModel);
                oAuthModel.setProperty("/loggedUserData", null);
                oAuthModel.setProperty("/isUserAuth", false);
            },

        });
    });
