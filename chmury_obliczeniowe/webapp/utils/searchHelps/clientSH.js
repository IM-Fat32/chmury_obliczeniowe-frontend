sap.ui.define([
    "../custom/customProperties",
    "../constants/NAMES"
], function (
    CustomProperties,
    NAMES
) {
    "use strict";
    return {
        open: function (oController, oInput) {
            const oShDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.ClientSearchHelpDialog", this);

            oController.getView().addDependent(oShDialog);
            CustomProperties.addCustomProperties(this, [
                { name: "controller", value: oController },
                { name: "shDialog", value: oShDialog },
                { name: "input", value: oInput },
            ], false);

            oShDialog.open();
            this.getSHData(null);
        },

        onDialogClose: function () {
            this.getShDialog().destroy();
        },

        onDialogConfirm: function (oEvent) {
            const oSearchHelpsModel = this.getController().getOwnerComponent().getModel(NAMES.getModels().searchHelpsModel);
            const oDevicesDataModel = this.getController().getOwnerComponent().getModel(NAMES.getModels().devicesModel);
            const sBindingPath = oEvent.getParameter("selectedItem").getBindingContextPath();
            const oItemData = oSearchHelpsModel.getProperty(sBindingPath);

            oDevicesDataModel.setProperty(this.getInput().getBinding("selectedKey").getPath(), oItemData.id);
        },

        getSHData: function (oController) {
            if (oController !== null)
                CustomProperties.addCustomProperties(this, [{ name: "controller", value: oController },], false);

            const oSearchHelpsModel = this.getController().getOwnerComponent().getModel(NAMES.getModels().searchHelpsModel);
            const oFirestore = this.getController().getOwnerComponent().getModel("firebase").getData().firestore;
            const oClientsCollection = oFirestore.collection("clients");

            if (oController === null)
                this.getShDialog().setBusy(true);

            oClientsCollection.get().then(
                function (oCollectionData) {
                    const aClientsData = [];

                    for (const oDocument of oCollectionData.docs)
                        aClientsData.push({ ...oDocument.data(), id: oDocument.id });

                    if (oController === null)
                        this.getShDialog().setBusy(false);
                    oSearchHelpsModel.setProperty("/clientsShData", aClientsData);

                }.bind(this)
            ).catch((oError) => {
                if (oController === null)
                    this.getShDialog().setBusy(false);
                ErrorDialog.open(this, this.getI18nText("loadingClientsDataError"));
            });
        }
    };
});