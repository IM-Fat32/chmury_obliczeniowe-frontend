sap.ui.define([
	"sap/ui/model/json/JSONModel",
], function (JSONModel) {
	"use strict";
	
	// Firebase-config retrieved from the Firebase-console
    const firebaseConfig = {
        apiKey: "AIzaSyD6Mm_bwj-ZoFxEDXwuTTD_XRYivFQicu0",
        authDomain: "livechat-3dc4b.firebaseapp.com",
        databaseURL: "https://livechat-3dc4b.firebaseio.com",
        projectId: "livechat-3dc4b",
        storageBucket: "livechat-3dc4b.appspot.com",
        messagingSenderId: "672094073170",
        appId: "1:672094073170:web:c42b8619250e833a598a8b",
        measurementId: "G-M313JT56EF"
      };

	return {
		initializeFirebase: function () {
			// Initialize Firebase with the Firebase-config
			firebase.initializeApp(firebaseConfig);
			return new JSONModel( {firestore: firebase.firestore()});
		}
	};
});