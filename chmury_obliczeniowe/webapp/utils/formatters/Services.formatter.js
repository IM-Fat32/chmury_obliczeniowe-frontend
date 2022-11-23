sap.ui.define([], function () {
    "use strict";
    return {
        formatServiceText: function (sStatus) {
            if (sStatus === "Z")
                return "Zakończone"

            if (sStatus === "R")
                return "Realizowane";

            if (sStatus === "N")
                return "Nowe"
        },

        formatPickupText: function (sStatus) {
            if (sStatus === "O")
                return "Odebrane";

            if (sStatus === "N")
                return "Nieodebrane";

            return this.getI18nText("pickupStatusNone");
        },

        formatServiceStatus: function (sStatus) {
            if (sStatus === "Z")
                return "Success";

            if (sStatus === "R")
                return "Information";

            if (sStatus === "N")
                return "Warning";

            return "None";
        },

        formatPickupStatus: function (sStatus) {
            if (sStatus === "O")
                return "Success";

            if (sStatus === "N")
                return "Warning";

            return "None";
        },

        formatServiceTextAndLabel: function (sServiceStatus, sPickupStatus) {
            let sServiceText;
            let sPickupText;

            if (sServiceStatus === "Z")
                sServiceText = "Status zgłoszenia: Zakończone";

            if (sServiceStatus === "R")
                sServiceText = "Status zgłoszenia: Realizowane";

            if (sServiceStatus === "N")
                sServiceText = "Status zgłoszenia: Nowe";


            if (sPickupStatus === "O")
                sPickupText = "Status odbioru: Odebrane";

            if (sPickupStatus === "N")
                sPickupText = "Status odbioru: Nieodebrane";

            sPickupText = "Status odbioru: " + "Brak";

            return `${sServiceText} | ${sPickupText}`

        },


    };
});