sap.ui.define([
    "../custom/customProperties"
], function(
    CustomProperties
) {
	"use strict";
	return  {
        open: function(sMessage) {
            sap.m.MessageBox.error(sMessage);
        }
	};
});