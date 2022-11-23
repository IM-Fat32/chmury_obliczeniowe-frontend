sap.ui.define([
    "./BaseController",
    "../utils/constants/NAMES",
    "../utils/custom/customProperties",
    "../utils/dialogs/busy",
    "../utils/forms/common",
],
    function (
        BaseController,
        NAMES,
        CustomProperties,
        BusyDialog,
        Forms
    ) {
        "use strict";

        return BaseController.extend("chm.obl.chmuryobliczeniowe.controller.Login", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Login").attachMatched(this._onPatternMatched, this);
            },

            onAfterRendering: function () {
                CustomProperties.addCustomProperties(this, [
                    { name: "passwordInput", value: this.getView().byId("login-password--input") },
                    { name: "emailInput", value: this.getView().byId("login-email--input") },
                ], false);

                this.setShowPasswordEvents(this.getPasswordInput());
            },

            onCharChange: function (oEvent) {
                const oLoginViewModel = this.getOwnerComponent().getModel(NAMES.getModels().loginViewModel);
                Forms.handleInputCharChange(this, oEvent, oLoginViewModel);
            },

            onEmailValueChange: function (oEvent) {
                const oLoginViewModel = this.getOwnerComponent().getModel(NAMES.getModels().loginViewModel);
                Forms.handleEmailChange(this, oEvent, oLoginViewModel)
            },

            onLoginPress: function () {
                const oLoginData = this._getLoginData();
                BusyDialog.open(this, "Logowanie..");
                firebase.auth().signInWithEmailAndPassword(oLoginData.name, oLoginData.password).then((userCredential) => {
                    BusyDialog.close(this);
                    this._setLoggedUserData(userCredential.user);
                    this.getOwnerComponent().getRouter().navTo("Main");
                }).catch((oError) => {
                    BusyDialog.close(this);
                    this._handleLoginError(oError);
                });
            },

            onRegister: function () {
                this.getOwnerComponent().getRouter().navTo("Signup");
            },

            _handleLoginError: function (oError) {
                if (oError.code.includes("password") || oError.code.includes("Password"))
                    this._handleWrongPassword(oError.message);

                if (oError.code.includes("email") || oError.code.includes("Email"))
                    this._handleWrongLogin(oError.message);
            },

            _handleWrongLogin: function (sErrorMessage) {
                this.getEmailInput().setValueState("Error");
                this.getEmailInput().setValueStateText(sErrorMessage);
            },

            _handleWrongPassword: function (sErrorMessage) {
                this.getPasswordInput().setValueState("Error");
                this.getPasswordInput().setValueStateText(sErrorMessage);
            },

            _setLoggedUserData: function (oUserData) {
                const oAuthModel = this.getOwnerComponent().getModel(NAMES.getModels().authModel);
                oAuthModel.setProperty("/loggedUserData", oUserData);
                oAuthModel.setProperty("/isUserAuth", true);
            },

            _onPatternMatched: function () {
                const oLoginViewModel = this.getOwnerComponent().getModel(NAMES.getModels().loginViewModel);
                oLoginViewModel.setProperty("/isLoginFilled", false);
                oLoginViewModel.setProperty("/isPasswordFilled", false);
                oLoginViewModel.setProperty("/isEmailValid", false);
                oLoginViewModel.setProperty("/userPassword", "");
                oLoginViewModel.setProperty("/userLogin", "");

                if (this.getEmailInput !== undefined && this.getPasswordInput !== undefined) {
                    this.getEmailInput().setValueState("None");
                    this.getPasswordInput().setValueState("None");
                }
            },

            _getLoginData: function () {
                const oLoginViewModel = this.getOwnerComponent().getModel(NAMES.getModels().loginViewModel);
                return {
                    name: oLoginViewModel.getProperty("/userLogin"),
                    password: oLoginViewModel.getProperty("/userPassword"),
                };
            },
        });
    });
