sap.ui.define([
    "../custom/customProperties",
    "./dialog",
], function (
    CustomProperties,
    Dialog
) {
    "use strict";
    return {
        open: function (oController, sMessage) {
            CustomProperties.addCustomProperties(this, [{
                name: "errorDialog", value: Dialog.getDialog(oController, "Error", sMessage,
                    function () {
                        this.getErrorDialog().close();
                    }.bind(this))
            }], false);

            this.getErrorDialog().open();
        },
    };
});