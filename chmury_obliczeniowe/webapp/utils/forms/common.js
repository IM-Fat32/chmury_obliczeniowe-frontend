sap.ui.define([
    "../constants/NAMES",
    "../validation/email",
    "../validation/password",
], function (
    NAMES,
    EmailValidation,
    PasswordValidation
) {
    "use strict";
    return {
        handleInputCharChange: function (oController, oEvent, oModel) {
            const oInput = oEvent.getSource();
            const sPath = oInput.getFieldGroupIds()[0];

            oModel.setProperty(`/${sPath}`, oInput.getValue().length > 0 ? true : false);
        },

        handleEmailChange: function (oController, oEvent, oModel) {
            const oInput = oEvent.getSource();

            if (!EmailValidation.validate(oInput.getValue())) {
                this._handleInvalidEmail(oController, oModel);
                return;
            }
            this._handleValidEmail(oController, oModel);
        },

        handlePasswordChange: function (oController, oEvent, oModel) {
            const oInput = oEvent.getSource();

            if (!PasswordValidation.validate(oInput.getValue())) {
                this._handleInvalidPassword(oController, oModel);
                return;
            }

            if (!this._checkPasswordsAreSame(oController)) {
                this._handleDiffrentPasswords(oController, oModel);
                return;
            }
            this._handlePasswordsSame(oController, oModel);
            this._handleValidPassword(oController, oModel);
        },

        handleRepeatPasswordChange: function (oController, oEvent, oModel) {
            const oInput = oEvent.getSource();

            if (!PasswordValidation.validate(oInput.getValue())) {
                this._handleInvalidRepeatPassword(oController, oModel);
                return;
            }

            if (!this._checkPasswordsAreSame(oController)) {
                this._handleDiffrentPasswords(oController, oModel);
                return;
            }
            this._handlePasswordsSame(oController, oModel);
            this._handleValidRepeatPassword(oController, oModel);
        },

        _checkPasswordsAreSame: function (oController) {
            if (oController.getRepeatPasswordInput().getValue() === "")
                return true;

            return oController.getRepeatPasswordInput().getValue() === oController.getPasswordInput().getValue();
        },

        _handlePasswordsSame: function(oController, oModel) {
            oController.getPasswordInput().setValueState("None");
            oModel.setProperty("/isPasswordValid", true);

            oController.getRepeatPasswordInput().setValueState("None");
            oModel.setProperty("/isPasswordRepeatValid", true);
        },

        _handleDiffrentPasswords: function (oController, oModel) {
            oController.getPasswordInput().setValueState("Error");
            oController.getPasswordInput().setValueStateText(oController.getI18nText("diffrentPasswords"));
            oModel.setProperty("/isPasswordValid", false);

            oController.getRepeatPasswordInput().setValueState("Error");
            oController.getRepeatPasswordInput().setValueStateText(oController.getI18nText("diffrentPasswords"));
            oModel.setProperty("/isPasswordRepeatValid", false);
        },

        _handleValidRepeatPassword: function (oController, oModel) {
            oController.getRepeatPasswordInput().setValueState("None");
            oModel.setProperty("/isPasswordRepeatValid", true);
        },

        _handleInvalidRepeatPassword: function (oController, oModel) {
            oController.getRepeatPasswordInput().setValueState("Error");
            oController.getRepeatPasswordInput().setValueStateText(oController.getI18nText("invalidPassword"));
            oModel.setProperty("/isPasswordRepeatValid", false);
        },

        _handleValidPassword: function (oController, oModel) {
            oController.getPasswordInput().setValueState("None");
            oModel.setProperty("/isPasswordValid", true);
        },

        _handleInvalidPassword: function (oController, oModel) {
            oController.getPasswordInput().setValueState("Error");
            oController.getPasswordInput().setValueStateText(oController.getI18nText("invalidPassword"));
            oModel.setProperty("/isPasswordValid", false);
        },

        _handleValidEmail: function (oController, oModel) {
            oController.getEmailInput().setValueState("None");
            oModel.setProperty("/isEmailValid", true);
        },

        _handleInvalidEmail: function (oController, oModel) {
            oController.getEmailInput().setValueState("Error");
            oController.getEmailInput().setValueStateText(oController.getI18nText("invalidEmail"));
            oModel.setProperty("/isEmailValid", false);
        },
    };
});