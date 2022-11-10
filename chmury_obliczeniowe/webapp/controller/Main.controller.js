sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("chm.obl.chmuryobliczeniowe.controller.Main", {
            onInit: function () {

            },

            onOpenDialog: function() {
                const oDialog = new sap.m.Dialog({
                    content: [
                        new sap.m.Text({text: "text"})
                    ]
                });
                
                oDialog.open();
            }
        });
    });
