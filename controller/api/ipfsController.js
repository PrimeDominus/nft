const express = require('express');
const router = express.Router();
const config = require('../../config/index')
const { success, error422, error501 } = require('../../function/response');
const { fileFromPath, storeNFT } = require('../../function/common');
const { Validator } = require('node-input-validator');
// const ipfsClient = require('ipfs-http-client');
// const ipfs = ipfsClient.create({
//     host: 'localhost',
//     port: config.PORT || 8080,
//     protocol: 'http',
//     headers: {
//         authorization: 'Bearer ' + config.IPFS_TOKEN
//     }
// });
const fs = require('fs');
const appRoot = require('app-root-path');
const { spawn, execSync, exec } = require('child_process');

/**
 * @description pack image files into car image
 * @param {String} project_id pass the project id . you will get the image car file CID.
*/
exports.createIpfsCarImage = async (req, res) => {
    const v = new Validator(req.body, {
        project_id: "required"
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }


    var projectPath = appRoot + "/nfts/" + req.body.project_id
    var projectImagePath = appRoot + "/nfts/" + req.body.project_id + "/images"

    try {
        exec('ls nfts', (err1, stdout1, stderr1) => {
            if (err1) {
                console.log(err1);
                error422(res, "Cannot check project dir", err1)
                return false
            }

            result = stdout1.split('\n')
            var dir = result.includes(req.body.project_id);
            if (dir) {

                let createImageCarCommand = "npx ipfs-car --pack " + projectImagePath + " --output " + projectPath + "/images.car";

                exec(createImageCarCommand, (err2, stdout2, stderr2) => {
                    if (err2) {
                        console.log(err2);
                        error422(res, "Cannot create image.car file.", err2)
                        return false
                    }
                    var CIDImage = stdout2.split('\n')[0].split(':')[1].trim();

                    fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/images/", (er, files) => {
                        if (er) {
                            console.log(er)
                            error422(res, "Cannot count images", er);
                            return false;
                        }
                        success(res, "Create images car file", {
                            image_count: files.length,
                            CID: CIDImage
                        });
                    })

                });

            } else {
                console.log("directory not found");
                error422(res, 'Project setup not found', false);
            }


        });
    } catch (e) {
        console.log(e)
        error501(res)
        return false
    }
}


/**
 * @description pack image files into car image
 * @param {String} project_id pass the project id . you will get the image car file CID.
*/
exports.createIpfsCarMeta = async (req, res) => {
    const v = new Validator(req.body, {
        project_id: "required"
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }


    var projectPath = appRoot + "/nfts/" + req.body.project_id
    var projectMetaPath = appRoot + "/nfts/" + req.body.project_id + "/metadata"

    try {
        exec('ls nfts', (err1, stdout1, stderr1) => {
            if (err1) {
                console.log(err1);
                error422(res, "Cannot check project dir", err1)
                return false
            }

            result = stdout1.split('\n')
            var dir = result.includes(req.body.project_id);
            if (dir) {

                let createImageCarCommand = "npx ipfs-car --pack " + projectMetaPath + " --output " + projectPath + "/metadata.car";

                exec(createImageCarCommand, (err2, stdout2, stderr2) => {
                    if (err2) {
                        console.log(err2);
                        error422(res, "Cannot create metadata.car file.", err2)
                        return false
                    }
                    var CIDMeta = stdout2.split('\n')[0].split(':')[1].trim();
                    success(res, "Create metadata car file", CIDMeta);

                });

            } else {
                console.log("directory not found");
                error422(res, 'Project setup not found', false);
            }


        });
    } catch (e) {
        console.log(e)
        error501(res)
        return false
    }
}


/**
 * @description upload car files to ipfs file storage for nft metadata.
 * @param {String} project_id pass the project id 
*/
exports.uploadCarFiletoIpfs = async (req, res) => {
    const v = new Validator(req.body, {
        project_id: "required"
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }


    var projectPath = appRoot + "/nfts/" + req.body.project_id
    try {
        exec('ls nfts', async (err1, stdout1, stderr1) => {
            if (err1) {
                console.log(err1);
                error422(res, "Cannot check project dir", err1)
                return false
            }
            result = stdout1.split('\n')
            var dir = result.includes(req.body.project_id);
            if (dir) {
                const resultImage = await storeNFT(projectPath + "/images.car")
                const resultMeta = await storeNFT(projectPath + "/metadata.car")
                // console.log(result)

                success(res, "Your files stored in NFT storage, Now you are ready to deploy your NFT token. ", {
                    imageCar: resultImage,
                    metaCar: resultMeta,
                })

            } else {
                console.log("directory not found");
                error422(res, 'Project setup not found', false);
            }


        });

    } catch (e) {
        console.log(e);
        error501(res);
        return false;
    }
}