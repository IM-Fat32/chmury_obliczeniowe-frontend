sap.ui.define([
    "../custom/customProperties",
    "./dialog",
], function (
    CustomProperties,
    Dialog
) {
    "use strict";
    return {
        open: function (oController, sMessage, fnCallback) {
            CustomProperties.addCustomProperties(this, [{
                name: "successDialog", value: Dialog.getDialog(oController, "Success", sMessage,
                    function () {
                        this.getSuccessDialog().close();
                        fnCallback();
                    }.bind(this))
            }], false);

            this.getSuccessDialog().open();
        },
    };
});