const packageJson = require('package-json');
const config = require('../config/index')
const mime = require('mime');
const fs = require('fs');
const path = require('path');
const { NFTStorage, File } = require('nft.storage');

/**
 * a helper funcion to get npm packages latest version 
 * @param {String} packageName packageName which you want to see the latest version.
 * @param {Object} options optional parameter .
 * @returns {String} LTS version of mentioned package.
 */
const getLTSVersion = async (packageName, options = {}) => {
    return await packageJson(packageName.toLowerCase(), options);
}


/**
  * A helper to read a file from a location on disk and return a File object.
  * Note that this reads the entire file into memory and should not be used for
  * very large files. 
  * @param {string} filePath the path to a file to store
  * @returns {File} a File object containing the file content
  */
const fileFromPath = async (filePath) => {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}


/**
  * Reads an image file from `imagePath` and stores an NFT with the given name and description.
  * @param {string} imagePath the path to an image file
  * @param {string} name a name for the NFT
  * @param {string} description a text description for the NFT
*/
const storeNFT = async (imagePath, name, description) => {
    const image = await fileFromPath(imagePath)
    const nftstorage = new NFTStorage({ token: config.IPFS_TOKEN })    
    return nftstorage.store({
        image,
        name,
        description,
    })
}

module.exports = {
    getLTSVersion,
    fileFromPath,
    storeNFT
}