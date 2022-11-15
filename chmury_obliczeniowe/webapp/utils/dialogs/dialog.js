sap.ui.define([], function () {
    "use strict";
    return {
        getDialog: function (oController, sDialogType, sMessage, fnCallback) {
            const sDialogTitle = sDialogType === "Error" ? oController.getI18nText("error") : oController.getI18nText("success");

            return new sap.m.Dialog({
                type: "Message",
                title: sDialogTitle,
                state: sDialogType,
                content: new sap.m.Text({ text: sMessage }),
                beginButton: new sap.m.Button({
                    type: "Emphasized",
                    text: oController.getI18nText("close"),
                    press: function () {
                        fnCallback();
                    }.bind(this)
                })
            });
        }
    };
});