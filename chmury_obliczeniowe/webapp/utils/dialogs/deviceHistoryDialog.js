sap.ui.define([
    "../custom/customProperties",
    "../constants/NAMES",
    "../formatters/Services.formatter",
], function (
    CustomProperties,
    NAMES,
    //formatters
    ServicesFormatter
) {
    "use strict";

    return {
        open: function (oController, sDeviceId) {
            CustomProperties.addCustomProperties(oController.getOwnerComponent(), [
                {
                    name: "historyDialog",
                    value: new sap.m.Dialog({
                        contentWidth: "450px",
                        title: oController.getI18nText("deviceHistory"),
                        titleAlignment: "Center",
                        content: [
                            new sap.m.List({
                                width: "100%"
                            }).bindItems({
                                path: 'devicesModel>/historyData',
                                template: new sap.m.StandardListItem({
                                    title: "Data rozpoczęcia: {devicesModel>startDate}",
                                    description: { path: 'devicesModel>serviceStatus', formatter: ServicesFormatter.formatServiceTextAndLabel.bind(oController) }
                                })
                            })
                        ],
                        beginButton: new sap.m.Button({
                            text: oController.getI18nText("close"),
                            press: function () {
                                oController.getOwnerComponent().getHistoryDialog().close();
                            }
                        })
                    })
                }
            ], false);

            oController.getView().addDependent(oController.getOwnerComponent().getHistoryDialog());
            oController.getOwnerComponent().getHistoryDialog().open();

            const oFirestore = oController.getOwnerComponent().getModel("firebase").getData().firestore;
            const oServicesCollection = oFirestore.collection("services");

            //dziala, zwraca tylko te co spelniaja warunek
            oServicesCollection.where("deviceId", "==", sDeviceId).get().then(
                function (oCollectionData) {
                    const aHistoryData = [];

                    for (const oService of oCollectionData.docs)
                        aHistoryData.push(oService.data());

                    debugger;
                    oController.getOwnerComponent().getModel(NAMES.getModels().devicesModel).setProperty("/historyData", aHistoryData);
                }.bind(this)
            ).catch((oError) => {
            });
        },
    };
});