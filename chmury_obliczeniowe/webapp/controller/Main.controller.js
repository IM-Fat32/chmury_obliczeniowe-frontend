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

            onAvatarPress: function(event) {
                const avatar = event.getSource();
                const actionSheet = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.UserActions", this);
                actionSheet.openBy(avatar);
            },

            onLogin: function() {
                this.getOwnerComponent().getRouter().navTo("Login");
            },

            onOpenDialog: function() {
                const dialog = new sap.m.Dialog({
                    content: [
                        new sap.m.Text({text: "text"})
                    ]
                });
                
                dialog.open();
            }
        });
    });
