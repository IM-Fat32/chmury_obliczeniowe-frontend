sap.ui.define([
    "../custom/customProperties",
    "../dialogs/error",
    "../dialogs/busy",
    //formatters
    "../formatters/Services.formatter",
], function (
    CustomProperties,
    ErrorDialog,
    BusyDialog,
    ServicesFormatter
) {
    "use strict";

    return {
        open: function (oController, oDocument) {
            CustomProperties.addCustomProperties(this, [{ name: "controller", value: oController }], false);
            CustomProperties.addCustomProperties(oController.getOwnerComponent(), [
                {
                    name: "serviceDetailsDialog",
                    value: new sap.m.Dialog({
                        title: oController.getI18nText("serviceDetails"),
                        titleAlignment: "Center",
                        contentHeight: "500px",
                        contentWidth: "500px",
                        beginButton: new sap.m.Button({
                            text: oController.getI18nText("close"),
                            press: function () {
                                oController.getOwnerComponent().getServiceDetailsDialog().close();
                            }
                        })
                    })
                }
            ], false);


            oController.getOwnerComponent().getServiceDetailsDialog().open();

            oDocument.ref.get().then(function (oCollectionData) {
                const oServiceData = oCollectionData.data();
                oServiceData.startDate = oServiceData.startDate.toDate !== undefined ? oServiceData.startDate.toDate().toLocaleDateString() : oServiceData.startDate;
                oServiceData.receiptDate = oServiceData.receiptDate.toDate !== undefined ? oServiceData.receiptDate.toDate().toLocaleDateString() : oServiceData.receiptDate;
                oServiceData.endDate = oServiceData.endDate.toDate !== undefined ? oServiceData.endDate.toDate().toLocaleDateString() : oServiceData.endDate;

                const oFirestore = this.getController().getOwnerComponent().getModel("firebase").getData().firestore;
                const oDevicesCollection = oFirestore.collection("devices");

                BusyDialog.open(this.getController(), "");
                oDevicesCollection.get().then(function (oDevicesData) {
                    for (const oDevice of oDevicesData.docs)
                        if (oServiceData.deviceId === oDevice.id)
                            oServiceData.deviceData = oDevice.data();


                    const oFirestore = this.getController().getOwnerComponent().getModel("firebase").getData().firestore;
                    const oClientsCollection = oFirestore.collection("clients");
                    oClientsCollection.get().then(
                        function (oCollectionData) {
                            for (const oClient of oCollectionData.docs)
                                if (oServiceData.deviceData.clientId === oClient.id) {
                                    const oClientData = oClient.data();
                                    oServiceData.clientName = `${oClientData.name} ${oClientData.surname}`;
                                }

                            oController.getOwnerComponent().getServiceDetailsDialog().setModel(new sap.ui.model.json.JSONModel(oServiceData));
                            oController.getOwnerComponent().getServiceDetailsDialog().removeAllContent();
                            oController.getOwnerComponent().getServiceDetailsDialog().addContent(this._getContent());

                            BusyDialog.close(this.getController());
                        }.bind(this)
                    ).catch((oError) => {
                        BusyDialog.close(this.getController());
                        ErrorDialog.open(this.getController(), this.getController().getI18nText("loadingDataError"));
                    });
                }.bind(this))
            }.bind(this)).catch((oError) => {
                BusyDialog.close(this.getController());
                ErrorDialog.open(this.getController(), this.getController().getI18nText("loadingDataError"));
            });
        },

        _getContent: function () {
            return new sap.m.VBox({
                items: [
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("clientName")}:` }),
                            new sap.m.Text({ text: "{/clientName}" }).addStyleClass("sapUiTinyMarginBegin")
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("device")}:` }),
                            new sap.m.Text({ text: "{/deviceData/brand} {/deviceData/model} {/deviceData/ram} {/deviceData/processor}" }).addStyleClass("sapUiTinyMarginBegin")
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("startDate")}:` }),
                            new sap.m.Text({ text: "{/startDate}" }).addStyleClass("sapUiTinyMarginBegin")
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("endDate")}:` }),
                            new sap.m.Text({ text: "{/endDate}" }).addStyleClass("sapUiTinyMarginBegin")
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("serviceStatus")}:` }),
                            new sap.m.ObjectStatus({
                                inverted: true,
                                text: { path: '/serviceStatus', formatter: ServicesFormatter.formatServiceText.bind(this.getController()) },
                                state: { path: '/serviceStatus', formatter: ServicesFormatter.formatServiceStatus }
                            }).addStyleClass("sapUiTinyMarginBegin"),
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("pickupDate")}:` }),
                            new sap.m.Text({ text: "{/receiptDate}" }).addStyleClass("sapUiTinyMarginBegin")
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("pickupStatus")}:` }),
                            new sap.m.ObjectStatus({
                                inverted: true,
                                text: { path: '/pickupStatus', formatter: ServicesFormatter.formatPickupText.bind(this.getController()) },
                                state: { path: '/pickupStatus', formatter: ServicesFormatter.formatPickupStatus }
                            }).addStyleClass("sapUiTinyMarginBegin"),
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.VBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("defectDescription")}:` }),
                            new sap.m.TextArea({
                                width: "100%",
                                rows: 5,
                                editable: false,
                                value: "{/reasonDescription}"
                            }),
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    new sap.m.VBox({
                        items: [
                            new sap.m.Label({ text: `${this.getController().getI18nText("fixDescription")}:` }),
                            new sap.m.TextArea({
                                width: "100%",
                                rows: 5,
                                editable: false,
                                value: "{/fixDescription}"
                            }),
                        ]
                    }).addStyleClass("sapUiTinyMarginBottom"),
                ]
            }).addStyleClass("sapUiSmallMargin");
        }
    }
});