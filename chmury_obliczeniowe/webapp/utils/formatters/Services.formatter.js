sap.ui.define([], function () {
    "use strict";
    return {
        formatServiceText: function (sStatus) {
            if (sStatus === "Z")
                return this.getI18nText("serviceStatusEnd");

            if (sStatus === "N")
                return this.getI18nText("serviceStatusNew");
        },

        formatPickupText: function (sStatus) {
            if (sStatus === "O")
                return this.getI18nText("pickupStatusEnd");

                return this.getI18nText("pickupStatusNone");
        },

        formatServiceStatus: function (sStatus) {
            if (sStatus === "Z")
                return "Success";

            if (sStatus === "N")
                return "Information";

            return "None";
        },

        formatPickupStatus: function (sStatus) {
            if (sStatus === "O")
                return "Success";

            return "None";
        }
    };
});