sap.ui.define([], function () {
    "use strict";
    return {
        getDialog: function (oController, sDialogType, sMessage, fnCallback) {
            return new sap.m.Dialog({
                type: "Message",
                title: sDialogType,
                state: sDialogType,
                content: new sap.m.Text({ text: sMessage }),
                beginButton: new sap.m.Button({
                    type: "Emphasized",
                    text: "Zamknij",
                    press: function () {
                        fnCallback();
                    }.bind(this)
                })
            });
        }
    };
});