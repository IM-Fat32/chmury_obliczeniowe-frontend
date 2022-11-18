sap.ui.define([], function () {
    "use strict";
    return {
        formatServiceText: function (sStatus) {
            if (sStatus === "Z")
                return this.getI18nText("serviceStatusEnd");
        },

        formatPickupText: function (sStatus) {
            if (sStatus === "O")
                return this.getI18nText("pickupStatusEnd");
        },

        formatServiceStatus: function (sStatus) {
            if (sStatus === "Z")
                return "Success";

            return "None";
        },

        formatPickupStatus: function (sStatus) {
            if (sStatus === "O")
                return "Success";

            return "None";
        }
    };
});