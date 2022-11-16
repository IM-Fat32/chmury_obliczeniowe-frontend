sap.ui.define([
    "./BaseController",
    "../utils/constants/NAMES",
    "../utils/custom/customProperties",
    "../utils/dialogs/busy",
    "../utils/dialogs/error",
    "../utils/dialogs/success",
],
    function (
        BaseController,
        NAMES,
        CustomProperties,
        BusyDialog,
        ErrorDialog,
        SuccessDialog
    ) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Clients", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Clients").attachMatched(this._onPatternMatched, this);
            },

            onCreateClientDialogOpen: function () {
                const oClientsDataModel = this.getOwnerComponent().getModel(NAMES.getModels().clientsModel);
                const oCreateClientDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.AddNewClient", this);
                
                CustomProperties.addCustomProperties(this, [{ name: "createClientDialog", value: oCreateClientDialog }], false);
                oCreateClientDialog.setTitle(this.getI18nText("createClient"));
                oClientsDataModel.setProperty("/newClient", {
                    isCreateEnabled: false,
                    isEditMode: false,
                    name: "",
                    surname: "",
                    city: "",
                    street: "",
                    houseNumber: "",
                    postalCode: ""
                });

                this.getView().addDependent(oCreateClientDialog);
                oCreateClientDialog.open();
            },

            onEditClientDialogOpen: function (oEvent) {
                const oClientsDataModel = this.getOwnerComponent().getModel(NAMES.getModels().clientsModel);
                const oCreateClientDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.AddNewClient", this);
                const sRowDataBindingPath = oEvent.getSource().getParent().getParent().getBindingContextPath(NAMES.getModels().clientsModel);
                const oRowData = oClientsDataModel.getProperty(sRowDataBindingPath);
                
                oCreateClientDialog.setTitle(this.getI18nText("editClient"));
                CustomProperties.addCustomProperties(this, [{ name: "createClientDialog", value: oCreateClientDialog }], false);
                oClientsDataModel.setProperty("/newClient", {
                    isCreateEnabled: true,
                    isEditMode: true,
                    document: oRowData.oDocument,
                    name: oRowData.name,
                    surname: oRowData.surname,
                    city: oRowData.city,
                    street: oRowData.street,
                    houseNumber: oRowData.houseNumber,
                    postalCode: oRowData.postalCode
                });

                this.getView().addDependent(oCreateClientDialog);
                oCreateClientDialog.open();
            },

            onValueChange: function () {
                const oClientsDataModel = this.getOwnerComponent().getModel(NAMES.getModels().clientsModel);
                const aFieldsData = Object.values(oClientsDataModel.getProperty("/newClient"));
                oClientsDataModel.setProperty("/newClient/isCreateEnabled", aFieldsData.every((value) => (value === "" ? false : true)));
            },

            onDeleteClient: function (oEvent) {
                const oClientsDataModel = this.getOwnerComponent().getModel(NAMES.getModels().clientsModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oClientsCollection = oFirestore.collection("clients");
                const sRowDataBindingPath = oEvent.getSource().getParent().getParent().getBindingContextPath(NAMES.getModels().clientsModel);
                const oRowData = oClientsDataModel.getProperty(sRowDataBindingPath);

                BusyDialog.open(this, this.getI18nText("deletingClient"));
                oRowData.oDocument.ref.delete().then(function () {
                    BusyDialog.close(this);
                    sap.m.MessageToast.show(this.getI18nText("deleteUserSuccess"));
                    this._getClientsData(oClientsCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("deleteUserError"));
                });
            },

            onUpdateClient: function (oEvent) {
                const oClientsDataModel = this.getOwnerComponent().getModel(NAMES.getModels().clientsModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oClientsCollection = oFirestore.collection("clients");
                const oRowData = oClientsDataModel.getProperty("/newClient");
                const oPayload = {
                    city: oRowData.city,
                    houseNumber: oRowData.houseNumber,
                    name: oRowData.name,
                    postalCode: oRowData.postalCode,
                    street: oRowData.street,
                    surname: oRowData.surname
                };

                BusyDialog.open(this, this.getI18nText("updatingClient"));
                oRowData.document.ref.update(oPayload).then(function () {
                    BusyDialog.close(this);
                    this.getCreateClientDialog().close();
                    sap.m.MessageToast.show(this.getI18nText("updateClientSucces"));
                    this._getClientsData(oClientsCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("updateClientError"));
                });
            },

            onCreateClient: function () {
                const oClientsDataModel = this.getOwnerComponent().getModel(NAMES.getModels().clientsModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oClientsCollection = oFirestore.collection("clients");
                const oUserData = oClientsDataModel.getProperty("/newClient");

                BusyDialog.open(this, this.getI18nText("addingClient"));
                oClientsCollection.add({
                    city: oUserData.city,
                    houseNumber: oUserData.houseNumber,
                    name: oUserData.name,
                    postalCode: oUserData.postalCode,
                    street: oUserData.street,
                    surname: oUserData.surname
                }).then(function () {
                    BusyDialog.close(this);
                    sap.m.MessageToast.show(this.getI18nText("addClientSuccess"));
                    this.getCreateClientDialog().close();
                    this._getClientsData(oClientsCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("addingUserError"));
                });
            },

            _getClientsData: function (oClientsCollection) {
                const oClientsDataModel = this.getOwnerComponent().getModel(NAMES.getModels().clientsModel);

                BusyDialog.open(this, this.getI18nText("loadingClientsData"));
                oClientsCollection.get().then(
                    function (oCollectionData) {
                        const aClientsData = [];

                        for (const oDocument of oCollectionData.docs)
                            aClientsData.push({ ...oDocument.data(), oDocument: oDocument });

                        BusyDialog.close(this);
                        oClientsDataModel.setProperty("/tableData", aClientsData);
                    }.bind(this)
                ).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("loadingClientsDataError"));
                });
            },

            _onPatternMatched: function () {
                const oAuthModel = this.getOwnerComponent().getModel(NAMES.getModels().authModel);
                if (!oAuthModel.getProperty("/isUserAuth")) {
                    this.getOwnerComponent().getRouter().navTo("Login");
                    return;
                }

                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oClientsCollection = oFirestore.collection("clients");
                this._getClientsData(oClientsCollection);
            }
        });
    });
