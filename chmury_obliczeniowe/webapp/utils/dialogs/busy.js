sap.ui.define([
    "../custom/customProperties"
], function (
    CustomProperties
) {
    "use strict";

    return {
        open: function (oController, sTitleName) {
            CustomProperties.addCustomProperties(oController.getOwnerComponent(), [
                {
                    name: "busyDialog",
                    value: new sap.m.BusyDialog({
                        title: sTitleName,
                        titleAlignment: "Center"
                    })
                }
            ], false);

            oController.getOwnerComponent().getBusyDialog().open();
        },

        close: function (oController) {
            oController.getOwnerComponent().getBusyDialog().close();
        }
    };
});