sap.ui.define([
    "./BaseController",
    "../utils/constants/NAMES",
    "../utils/custom/customProperties",
    "../utils/dialogs/error",
    "../utils/dialogs/busy",
    "../utils/searchHelps/deviceSH",
    "../utils/dialogs/serviceDetails",
    //formatters
    "../utils/formatters/Services.formatter",
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
        DevicesSH,
        ServiceDetails,
        //formatters
        ServicesFormatter
    ) {
        "use strict";
        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Services", {
            servicesFormatter: ServicesFormatter,

            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Services").attachMatched(this._onPatternMatched, this);
            },

            openShDialog: function (oEvent) {
                DevicesSH.open(this, oEvent.getSource());
            },

            onValueChange: function (oEvent) {
                const oServicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                const aFieldsData = Object.values(oServicesDataModel.getProperty("/newService"));
                oServicesDataModel.setProperty("/newService/isCreateEnabled", aFieldsData.every((value) => (value === "" ? false : true)));
            },

            onCreateServiceDialogOpen: function () {
                const oServicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                const oCreateServiceDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.AddService", this);

                CustomProperties.addCustomProperties(this, [{ name: "createServiceDialog", value: oCreateServiceDialog }], false);
                oCreateServiceDialog.setTitle("Tworzenie zgłoszenia");

                oServicesDataModel.setProperty("/newService", {
                    isCreateEnabled: false,
                    isEditMode: false,
                    id: "",
                    description: "",
                    price: "",

                });

                this.getView().addDependent(oCreateServiceDialog);
                oCreateServiceDialog.open();
            },

            onUpdateService: function (oEvent) {
                const oServicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oServicesCollection = oFirestore.collection("services");
                const oServiceData = oServicesDataModel.getProperty("/newService");

                const oPayload = {
                    deviceId: oServiceData.id,
                    fixDescription: oServiceData.fixDescription,
                    pickupStatus: oServiceData.pickupStatus,
                    price: oServiceData.price,
                    reasonDescription: oServiceData.reasonDescription,
                    receiptDate: oServiceData.pickupStatus === "O" ? new Date() : "",
                    serviceStatus: oServiceData.serviceStatus,
                    startDate: oServiceData.startDate,
                    endDate: oServiceData.serviceStatus === "Z" ? new Date() : "",
                };

                BusyDialog.open(this, "Aktualizowanie danych zgłoszenia");
                oServiceData.document.ref.update(oPayload).then(function () {
                    BusyDialog.close(this);
                    this.getCreateServiceDialog().close();
                    sap.m.MessageToast.show("Dane zgłoszenia zostały zaktualizowane");
                    this._getServicesData(oServicesCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, "Aktualizowanie danych zgłoszenia nie powiodło się");
                });
            },

            onEditServiceDialogOpen: function (oEvent) {
                const oServiceDataModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                const oServicesDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.EditService", this);
                const sRowDataBindingPath = oEvent.getSource().getParent().getParent().getBindingContextPath(NAMES.getModels().servicesModel);
                const oRowData = oServiceDataModel.getProperty(sRowDataBindingPath);

                DevicesSH.getSHData(this);

                oServicesDialog.setTitle(this.getI18nText("editService"));
                CustomProperties.addCustomProperties(this, [{ name: "createServiceDialog", value: oServicesDialog }], false);
                oServiceDataModel.setProperty("/newService", {
                    isCreateEnabled: true,
                    isEditMode: true,
                    id: oRowData.deviceId,
                    reasonDescription: oRowData.reasonDescription,
                    fixDescription: oRowData.fixDescription,
                    serviceStatus: oRowData.serviceStatus,
                    pickupStatus: oRowData.pickupStatus,
                    price: oRowData.price,
                    startDate: oRowData.startDate,
                    endDate: oRowData.endDate === "" ? null : oRowData.endDate,
                    receiptDate: oRowData.receiptDate === "" ? null : oRowData.receiptDate,
                    document: oRowData.oDocument,
                });

                this.getView().addDependent(oServicesDialog);
                oServicesDialog.open();
            },


            onCreateService: function () {
                const oServicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oServicesCollection = oFirestore.collection("services");
                const oServiceData = oServicesDataModel.getProperty("/newService");

                BusyDialog.open(this, "Dodawanie zgłoszenia..");
                oServicesCollection.add({
                    deviceId: oServiceData.id,
                    startDate: new Date(),
                    endDate: "",
                    fixDescription: "",
                    pickupStatus: "B",
                    price: oServiceData.price,
                    reasonDescription: oServiceData.description,
                    receiptDate: "",
                    serviceStatus: "N"
                }).then(function () {
                    BusyDialog.close(this);
                    sap.m.MessageToast.show("Urządzenie dostało dodane");
                    this.getCreateServiceDialog().close();
                    this._getServicesData(oServicesCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, "Podczas dodawania urządzenia wystąpił błąd");
                });
            },

            _onPatternMatched: function () {
                const oAuthModel = this.getOwnerComponent().getModel(NAMES.getModels().authModel);
                if (!oAuthModel.getProperty("/isUserAuth")) {
                    this.getOwnerComponent().getRouter().navTo("Login");
                    return;
                }

                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oServicesCollection = oFirestore.collection("services");
                this._getServicesData(oServicesCollection);
            },

            _getServicesData: function (oServicesCollection) {
                const oServicesModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                BusyDialog.open(this, "Pobieranie danych");
                oServicesCollection.get().then(
                    function (oCollectionData) {
                        const aServicesData = [];

                        for (const oDocument of oCollectionData.docs) {
                            const oDocumentData = { ...oDocument.data(), oDocument: oDocument };

                            oDocumentData.startDate = oDocumentData.startDate.toDate !== undefined ? oDocumentData.startDate.toDate().toLocaleDateString() : oDocumentData.startDate;
                            oDocumentData.receiptDate = oDocumentData.receiptDate.toDate !== undefined ? oDocumentData.receiptDate.toDate().toLocaleDateString() : oDocumentData.receiptDate;
                            oDocumentData.endDate = oDocumentData.endDate.toDate !== undefined ? oDocumentData.endDate.toDate().toLocaleDateString() : oDocumentData.endDate;

                            aServicesData.push(oDocumentData);
                        }

                        const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                        const oDevicesCollection = oFirestore.collection("devices");
                        oDevicesCollection.get().then(
                            function (oDevicesData) {
                                for (const oServiceData of aServicesData) {
                                    for (const oDevice of oDevicesData.docs)
                                        if (oServiceData.deviceId === oDevice.id)
                                            oServiceData.deviceData = oDevice.data();


                                    const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                                    const oClientsCollection = oFirestore.collection("clients");
                                    oClientsCollection.get().then(
                                        function (oCollectionData) {
                                            for (const oServiceData of aServicesData) {
                                                for (const oClient of oCollectionData.docs)
                                                    if (oServiceData.deviceData.clientId === oClient.id) {
                                                        const oClientData = oClient.data();
                                                        oServiceData.clientName = `${oClientData.name} ${oClientData.surname}`;
                                                    }
                                            }

                                            oServicesModel.setProperty("/tableData", aServicesData);

                                            this._bindTableItems();

                                            BusyDialog.close(this);
                                        }.bind(this)
                                    ).catch((oError) => {
                                        BusyDialog.close(this);
                                        ErrorDialog.open(this, "Pobieranie danych nie powiodło się");
                                    });
                                }
                            }.bind(this)
                        ).catch((oError) => {
                            BusyDialog.close(this);
                            ErrorDialog.open(this, "Pobieranie danych nie powiodło się");
                        });
                    }.bind(this)
                ).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, "Pobieranie danych nie powiodło się");
                });
            },


            _bindTableItems: function () {
                this.getView().byId("test").bindItems({
                    path: 'servicesModel>/tableData',
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{servicesModel>deviceData/brand} {servicesModel>deviceData/model} {servicesModel>deviceData/processor} {servicesModel>deviceData/ram}" }),
                            new sap.m.Text({ text: "{servicesModel>startDate}" }),
                            new sap.m.ObjectStatus({
                                inverted: true,
                                text: { path: 'servicesModel>serviceStatus', formatter: ServicesFormatter.formatServiceText.bind(this) },
                                state: { path: 'servicesModel>serviceStatus', formatter: ServicesFormatter.formatServiceStatus }
                            }),
                            new sap.m.Text({ text: "{servicesModel>endDate}" }),
                            new sap.m.Text({ text: "{servicesModel>receiptDate}" }),
                            new sap.m.ObjectStatus({
                                inverted: true,
                                text: { path: 'servicesModel>pickupStatus', formatter: ServicesFormatter.formatPickupText.bind(this) },
                                state: { path: 'servicesModel>pickupStatus', formatter: ServicesFormatter.formatPickupStatus }
                            }),
                            new sap.m.ObjectNumber({
                                number: "{servicesModel>price}",
                                unit: "zł",
                                state: "Success"
                            }),
                            new sap.m.HBox({
                                items: [
                                    new sap.m.Button({
                                        icon: "sap-icon://hint",
                                        press: this.onOpenDetails.bind(this)
                                    }),
                                    new sap.m.Button({
                                        icon: "sap-icon://edit",
                                        press: this.onEditServiceDialogOpen.bind(this)
                                    }),
                                    new sap.m.Button({
                                        icon: "sap-icon://delete",
                                        press: this.onDeleteService.bind(this)
                                    })
                                ],
                                justifyContent: "SpaceAround"
                            })
                        ]
                    })
                });
            },

            onOpenDetails: function (oEvent) {
                const oServiceDataModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                const oItemData = oServiceDataModel.getProperty(oEvent.getSource().getParent().getParent().getBindingContextPath(NAMES.getModels().servicesModel));

                ServiceDetails.open(this, oItemData.oDocument)
            },

            onDeleteService: function (oEvent) {
                const oServicesDataModel = this.getOwnerComponent().getModel(NAMES.getModels().servicesModel);
                const oFirestore = this.getOwnerComponent().getModel("firebase").getData().firestore;
                const oServicesCollection = oFirestore.collection("services");
                const sRowDataBindingPath = oEvent.getSource().getParent().getParent().getBindingContextPath(NAMES.getModels().servicesModel);
                const oRowData = oServicesDataModel.getProperty(sRowDataBindingPath);

                BusyDialog.open(this, "Usuwanie danych urządzenia..");
                oRowData.oDocument.ref.delete().then(function () {
                    BusyDialog.close(this);
                    sap.m.MessageToast.show("Usuwanie danych urządzenia powiodło się");
                    this._getServicesData(oServicesCollection);
                }.bind(this)).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, "Usuwanie danych urządzenia nie powiodło się");
                });
            },

        });
    });

