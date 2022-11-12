sap.ui.define([], function () {
    "use strict";
    return {

        /**
         * Add to element custom properties with get and set method
         * @public
         * @param {Any} oMainObject Object to which property will be added
         * @param {Array} aArray array with objects with names and values of custom properties 
         * @param {Boolean} bAddSetter flag if create set method
         */
        addCustomProperties: function (oMainObject, aArray, bAddSetter) {
            aArray.forEach(oProp => {
                oMainObject[`_${oProp.name}`] = oProp.value;

                /**
                 * Get value of custom property
                 * @public
                 * @returns {*}
                 */
                oMainObject[`get${this._createMethodName(oProp.name)}`] = function () {
                    return this[`_${oProp.name}`];
                }.bind(oMainObject);

                if (bAddSetter) {
                    /**
                     * Set value of custom property
                     * @public
                     * @param {*} newValue
                     */
                    oMainObject[`set${this._createMethodName(oProp.name)}`] = function (newValue) {
                        this[`_${oProp.name}`] = newValue;
                    }.bind(oMainObject);
                }
            });
        },

        /**
         * Create name for method from property name
         * @private
         * @param {String} sPropName 
         * @returns {String}
         */
        _createMethodName: function (sPropName) {
            return sPropName[0].toUpperCase() + sPropName.substring(1);
        }
    }
});