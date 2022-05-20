import packageJson from 'package-json';
const config = require('./../../config')
const mine = require('mime');
import fs from 'fs';
import path from 'path';
import { NFTStorage, File } from 'nft.storage';


/**
 * a helper funcion to get npm packages latest version 
 * @param {String} packageName packageName which you want to see the latest version.
 * @param {Object} options optional parameter .
 * @returns {String} LTS version of mentioned package.
 */
export const getLTSVersion = async (packageName: any, options: any = {}) => {
    return await packageJson(packageName.toLowerCase(), options);
}


/**
  * A helper to read a file from a location on disk and return a File object.
  * Note that this reads the entire file into memory and should not be used for
  * very large files. 
  * @param {string} filePath the path to a file to store
  * @returns {File} a File object containing the file content
*/
export const fileFromPath = async (filePath: any) => {
    const content = await fs.promises.readFile(filePath)
    const type = mine.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}


/**
  * Reads an image file from `filePath` and stores an NFT with the given name and description.
  * @param {string} filePath the path to an car file
*/
export const storeNFT = async (filePath:any) => {
    const file = await fileFromPath(filePath)
    const nftstorage = new NFTStorage({ token: config.IPFS_TOKEN })
    return await nftstorage.storeCar(file)
}