sap.ui.define([
    "../custom/customProperties",
], function (
    CustomProperties,
) {
    "use strict";

    return {
        open: function (oController, sDeviceId) {
            CustomProperties.addCustomProperties(oController.getOwnerComponent(), [
                {
                    name: "historyDialog",
                    value: new sap.m.Dialog({
                        title: oController.getI18nText("deviceHistory"),
                        titleAlignment: "Center",
                        beginButton: new sap.m.Button({
                            text: oController.getI18nText("close"),
                            press: function () {
                                oController.getOwnerComponent().getHistoryDialog().close();
                            }
                        })
                    })
                }
            ], false);

            oController.getOwnerComponent().getHistoryDialog().open();

            const oFirestore = oController.getOwnerComponent().getModel("firebase").getData().firestore;
            const oServicesCollection = oFirestore.collection("services");

            //dziala, zwraca tylko te co spelniaja warunek
            oServicesCollection.where("deviceId", "==", "adsdsasad").get().then(
                function (oCollectionData) {
                    debugger;
                }.bind(this)
            ).catch((oError) => {
                debugger;
            });
        },
    };
});