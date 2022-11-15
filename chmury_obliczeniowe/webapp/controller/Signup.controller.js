sap.ui.define([
    "./BaseController",
    "../utils/constants/NAMES",
    "../utils/custom/customProperties",
    "../utils/forms/common",
    "../utils/dialogs/error",
    "../utils/dialogs/success",
    "../utils/dialogs/busy",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     */
    function (
        BaseController,
        NAMES,
        CustomProperties,
        Forms,
        ErrorDialog,
        SuccessDialog,
        BusyDialog
    ) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Signup", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Login").attachMatched(this._onPatternMatched, this);
            },

            onAfterRendering: function () {
                CustomProperties.addCustomProperties(this, [
                    { name: "passwordInput", value: this.getView().byId("signup-password--input") },
                    { name: "repeatPasswordInput", value: this.getView().byId("signup-repeat-password--input") },
                    { name: "emailInput", value: this.getView().byId("signup-email--input") },
                ], false);

                this.setShowPasswordEvents(this.getPasswordInput());
                this.setShowPasswordEvents(this.getRepeatPasswordInput());
            },

            onCharChange: function (oEvent) {
                const oSignupViewModel = this.getOwnerComponent().getModel(NAMES.getModels().signupViewModel);
                Forms.handleInputCharChange(this, oEvent, oSignupViewModel);
            },

            onPasswordChange: function (oEvent) {
                const oSignupViewModel = this.getOwnerComponent().getModel(NAMES.getModels().signupViewModel);
                Forms.handlePasswordChange(this, oEvent, oSignupViewModel);
            },

            onRepeatPasswordChange: function (oEvent) {
                const oSignupViewModel = this.getOwnerComponent().getModel(NAMES.getModels().signupViewModel);
                Forms.handleRepeatPasswordChange(this, oEvent, oSignupViewModel);
            },

            onEmailValueChange: function (oEvent) {
                const oSignupViewModel = this.getOwnerComponent().getModel(NAMES.getModels().signupViewModel);
                Forms.handleEmailChange(this, oEvent, oSignupViewModel)
            },

            onSignup: function () {
                const oSignupModel = this.getOwnerComponent().getModel(NAMES.getModels().signupViewModel);
                const sEmail = oSignupModel.getProperty("/userLogin");
                const sPassword = oSignupModel.getProperty("/userPassword");

                BusyDialog.open(this, "creatingAccount");
                firebase.auth().createUserWithEmailAndPassword(sEmail, sPassword).then((userCredential) => {
                    BusyDialog.close(this);
                    SuccessDialog.open(this, this.getI18nText("accountCreated"), function () { this.getOwnerComponent().getRouter().navTo("Login") }.bind(this));
                }).catch((oError) => {
                    BusyDialog.close(this);
                    ErrorDialog.open(this, oError.message);
                });
            },

            _onPatternMatched: function () {
                const oSignupViewModel = this.getOwnerComponent().getModel(NAMES.getModels().signupViewModel);
                oSignupViewModel.setProperty("/isLoginFilled", false);
                oSignupViewModel.setProperty("/isPasswordFilled", false);
                oSignupViewModel.setProperty("/isPasswordRepeatFilled", false);
                oSignupViewModel.setProperty("/isEmailValid", false);
                oSignupViewModel.setProperty("/isPasswordValid", false);
                oSignupViewModel.setProperty("/isPasswordRepeatValid", false);
                oSignupViewModel.setProperty("/userPassword", "");
                oSignupViewModel.setProperty("/userRepeatPassword", "");
                oSignupViewModel.setProperty("/userLogin", "");
            }
        });
    });
