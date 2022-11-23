sap.ui.define([
    "../custom/customProperties",
    "../constants/NAMES",
], function (
    CustomProperties,
    NAMES
) {
    "use strict";
    return {
        open: function (oController, oInput) {
            const oShDialog = sap.ui.xmlfragment("chm.obl.chmuryobliczeniowe.utils.fragments.DevicesSearchHelpDialog", this);

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
            const oServicesDataModel = this.getController().getOwnerComponent().getModel(NAMES.getModels().servicesModel);
            const sBindingPath = oEvent.getParameter("selectedItem").getBindingContextPath();
            const oItemData = oSearchHelpsModel.getProperty(sBindingPath);

            oServicesDataModel.setProperty(this.getInput().getBinding("selectedKey").getPath(), oItemData.id);
            this.getController().onValueChange();
        },

        getSHData: function (oController) {
            if (oController !== null)
                CustomProperties.addCustomProperties(this, [{ name: "controller", value: oController },], false);

            const oSearchHelpsModel = this.getController().getOwnerComponent().getModel(NAMES.getModels().searchHelpsModel);
            const oFirestore = this.getController().getOwnerComponent().getModel("firebase").getData().firestore;
            const oDevicesCollection = oFirestore.collection("devices");

            if (oController === null)
                this.getShDialog().setBusy(true);

            oDevicesCollection.get().then(
                function (oCollectionData) {
                    const aDevicesData = [];

                    for (const oDocument of oCollectionData.docs)
                        aDevicesData.push({ ...oDocument.data(), id: oDocument.id });

                    if (oController === null)
                        this.getShDialog().setBusy(false);
                    oSearchHelpsModel.setProperty("/devicesShData", aDevicesData);

                }.bind(this)
            ).catch((oError) => {
                if (oController === null)
                    this.getShDialog().setBusy(false);
                ErrorDialog.open(this, "Pobieranie danych nie powiodło się");
            });
        }
    };
});