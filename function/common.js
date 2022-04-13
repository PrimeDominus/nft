const packageJson = require('package-json');

/**
 * @description get npm packages latest version 
 * @param {String} packageName packageName which you want to see the latest version.
 * @param {Object} options optional parameter .
 */
const getLTSVersion = async (packageName, options = {}) => {
    return await packageJson(packageName.toLowerCase(), options);
}

module.exports = {
    getLTSVersion
}