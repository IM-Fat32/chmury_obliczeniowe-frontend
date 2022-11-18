sap.ui.define([
    "./BaseController",
    "../utils/constants/NAMES",
    "../utils/custom/customProperties",
    "../utils/dialogs/error",
    "../utils/dialogs/busy",
    "../utils/dialogs/deviceHistoryDialog",
    "../utils/searchHelps/clientSH"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     */
    function (
        BaseController,
        NAMES,
        CustomProperties,
        ErrorDialog,
        BusyDialog,
        DeviceHistoryDialog,
        ClientSH
    ) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Devices", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Devices").attachMatched(this._onPatternMatched, this);
            },

            onCreateDeviceDialogOpen: function () {
                const oDevicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().devicesModel);
                const oDeviceClientDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.AddNewDevice", this);

                CustomProperties.addCustomProperties(this, [{ name: "createDeviceDialog", value: oDeviceClientDialog }], false);
                oDeviceClientDialog.setTitle(this.getI18nText("createDevice"));
                oDevicesDataModel.setProperty("/newDevice", {
                    isCreateEnabled: false,
                    isEditMode: false,
                    brand: "",
                    guarantee: false,
                    isInService: false,
                    model: "",
                    price: "",
                    processor: "",
                    ram: "",
                    system: "",
                    clientId: ""
                });

                this.getView().addDependent(oDeviceClientDialog);
                oDeviceClientDialog.open();
            },

            onEditDeviceDialogOpen: function (oEvent) {
                const oDevicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().devicesModel);
                const oDeviceClientDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.AddNewDevice", this);
                const sRowDataBindingPath = oEvent.getSource().getParent().getParent().getBindingContextPath(NAMES.getModels().devicesModel);
                const oRowData = oDevicesDataModel.getProperty(sRowDataBindingPath);

                ClientSH.getSHData(this);

                oDeviceClientDialog.setTitle(this.getI18nText("editDevice"));
                CustomProperties.addCustomProperties(this, [{ name: "createDeviceDialog", value: oDeviceClientDialog }], false);
                oDevicesDataModel.setProperty("/newDevice", {
                    isCreateEnabled: true,
                    isEditMode: true,
                    brand: oRowData.brand,
                    guarantee: oRowData.guarantee,
                    isInService: oRowData.isInService,
                    model: oRowData.model,
                    price: oRowData.price,
                    processor: oRowData.processor,
                    ram: oRowData.ram,
                    system: oRowData.system,
                    clientId: oRowData.clientId,
                    document: oRowData.oDocument,
                });

                this.getView().addDependent(oDeviceClientDialog);
                oDeviceClientDialog.open();
            },

            onValueChange: function () {
                const oDevicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().devicesModel);
                const aFieldsData = Object.values(oDevicesDataModel.getProperty("/newDevice"));
                oDevicesDataModel.setProperty("/newDevice/isCreateEnabled", aFieldsData.every((value) => (value === "" ? false : true)));
            },

            onUpdateDevice: function (oEvent) {
                const oDevicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().devicesModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oDevicesCollection = oFirestore.collection("devices");
                const oDeviceData = oDevicesDataModel.getProperty("/newDevice");
                const oPayload = {
                    brand: oDeviceData.brand,
                    guarantee: oDeviceData.guarantee,
                    isInService: oDeviceData.isInService,
                    model: oDeviceData.model,
                    price: oDeviceData.price,
                    processor: oDeviceData.processor,
                    ram: oDeviceData.ram,
                    system: oDeviceData.system,
                    clientId: oDeviceData.clientId
                };

                BusyDialog.open(this, this.getI18nText("updatingDevice"));
                oDeviceData.document.ref.update(oPayload).then(function () {
                    BusyDialog.close(this);
                    this.getCreateDeviceDialog().close();
                    sap.m.MessageToast.show(this.getI18nText("updateDeviceSuccess"));
                    this._getDevicesData(oDevicesCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("updateDeviceError"));
                });
            },

            onDeleteDevice: function (oEvent) {
                const oDevicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().devicesModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oDevicesCollection = oFirestore.collection("devices");
                const sRowDataBindingPath = oEvent.getSource().getParent().getParent().getBindingContextPath(NAMES.getModels().devicesModel);
                const oRowData = oDevicesDataModel.getProperty(sRowDataBindingPath);

                BusyDialog.open(this, this.getI18nText("deletingDevice"));
                oRowData.oDocument.ref.delete().then(function () {
                    BusyDialog.close(this);
                    sap.m.MessageToast.show(this.getI18nText("deleteDeviceSuccess"));
                    this._getDevicesData(oDevicesCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("deleteDeviceError"));
                });
            },

            onCreateDevice: function () {
                const oDevicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().devicesModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oDevicesCollection = oFirestore.collection("devices");
                const oDeviceData = oDevicesDataModel.getProperty("/newDevice");

                BusyDialog.open(this, this.getI18nText("addingDevices"));
                oDevicesCollection.add({
                    brand: oDeviceData.brand,
                    guarantee: oDeviceData.guarantee,
                    isInService: oDeviceData.isInService,
                    model: oDeviceData.model,
                    price: oDeviceData.price,
                    processor: oDeviceData.processor,
                    ram: oDeviceData.ram,
                    system: oDeviceData.system,
                    clientId: oDeviceData.clientId
                }).then(function () {
                    BusyDialog.close(this);
                    sap.m.MessageToast.show(this.getI18nText("addDeviceSuccess"));
                    this.getCreateDeviceDialog().close();
                    this._getDevicesData(oDevicesCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("addingDevicerError"));
                });
            },

            openShDialog: function (oEvent) {
                ClientSH.open(this, oEvent.getSource());
            },

            _onPatternMatched: function () {
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oDevicesCollection = oFirestore.collection("devices");
                this._getDevicesData(oDevicesCollection);
            },

            _getDevicesData: function (oDevicesCollection) {
                const oDevicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().devicesModel);
                BusyDialog.open(this, this.getI18nText("loadingDevicesData"));
                oDevicesCollection.get().then(
                    function (oCollectionData) {
                        const aDevicesData = [];

                        for (const oDocument of oCollectionData.docs)
                            aDevicesData.push({ ...oDocument.data(), oDocument: oDocument });

                        const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                        const oClientsCollection = oFirestore.collection("clients");
                        oClientsCollection.get().then(
                            function (oCollectionData) {
                                for (const oDeviceData of aDevicesData) {
                                    for (const oClient of oCollectionData.docs)
                                        if (oDeviceData.clientId === oClient.id) {
                                            const oClientData = oClient.data();
                                            oDeviceData.clientName = `${oClientData.name} ${oClientData.surname}`;
                                        }
                                }

                                BusyDialog.close(this);
                                oDevicesDataModel.setProperty("/tableData", aDevicesData);
                            }.bind(this)
                        ).catch((oError) => {
                            BusyDialog.close(this);
                            ErrorDialog.open(this, this.getI18nText("loadingDataError"));
                        });
                    }.bind(this)
                ).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, this.getI18nText("loadingDataError"));
                });
            },

            onOpenHistory: function() {
                DeviceHistoryDialog.open(this, "ssss")
            }
        });
    });
