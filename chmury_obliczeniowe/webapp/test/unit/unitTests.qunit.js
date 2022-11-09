/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"chmobl/chmury_obliczeniowe/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
