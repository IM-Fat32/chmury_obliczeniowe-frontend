sap.ui.define([
    "../custom/customProperties"
], function (
    CustomProperties
) {
    "use strict";
    return {
        open: function (sMessage, fnCallback) {
            if (fnCallback === undefined || fnCallback === null) {
                sap.m.MessageBox.success(sMessage);
                return;
            }
            sap.m.MessageBox.success(sMessage, {
                onClose: function () {
                    fnCallback();
				}
            });
        }
    };
});