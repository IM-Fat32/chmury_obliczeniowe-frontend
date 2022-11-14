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

                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oClientsCollection = oFirestore.collection("clients");
                // this.getClients(oClientsCollection);
            },

            onAvatarPress: function (oEvent) {
                const oAvatar = oEvent.getSource();
                const oActionSheet = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.UserActions", this);
                this.getView().addDependent(oActionSheet);
                oActionSheet.openBy(oAvatar);
            },

            onLogout: function () {
                BusyDialog.open(this, "logoutAction");
                firebase.auth().signOut().then(() => {
                    this._setLoggedUserData();
                    BusyDialog.close(this);
                    this.getOwnerComponent().getRouter().navTo("Login");
                }).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(oError.message);
                });
            },

            getClients: function (collRefShipments) {
                collRefShipments.get().then(
                    function (oCollectionData) {
                        debugger;

                    }.bind(this));
            },

            _onPatternMatched: function () {
                const oAuthModel = this.getOwnerComponent().getModel(NAMES.getModels().authModel);

                if (!oAuthModel.getProperty("/isUserAuth"))
                    this.getOwnerComponent().getRouter().navTo("Login");
            },

            _setLoggedUserData: function () {
                const oAuthModel = this.getOwnerComponent().getModel(NAMES.getModels().authModel);
                oAuthModel.setProperty("/loggedUserData", null);
                oAuthModel.setProperty("/isUserAuth", false);
            },
        });
    });
