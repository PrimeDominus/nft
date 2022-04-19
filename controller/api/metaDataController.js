const express = require('express');
const router = express.Router();
const config = require('../../config/index')
const { success, error422, error501 } = require('../../function/response');
const { Validator } = require('node-input-validator');
const { spawn, execSync, exec } = require('child_process');
const fs = require("fs");
var appRoot = require('app-root-path');
/**
 * @description upload images for metadata for your nft
 * @param {String} project_id pass the project id . you will get the project id from setup api.
 * @param {String} image_name pass the image id . your meta data will save with this name in image directory.
 * @param {String} image pass base64 formated string for image which you want to upload for your nft metadata
 */

exports.uploadMetaImages = async (req, res) => {
    // validation
    const v = new Validator(req.body, {
        project_id: "required",
        image: "required"
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }

    var project_id = req.body.project_id
    try {
        exec('ls nfts', async (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                error422(res, "Cannot check project dir", err)
                return false
            }
            result = stdout.split('\n')
            var dir = result.includes(project_id);
            if (dir) {
                //count files
                await fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/images/", (er, files) => {
                    if (er) {
                        console.log(er)
                        error422(res, "Cannot count images", er);
                        return false;
                    }
                    // console.log(files.length);   
                    let fileName = files.length + 1
                    let fileNameFull = fileName + ".png"

                    //upload files
                    fs.writeFile(appRoot + "/nfts/" + req.body.project_id + "/images/" + fileNameFull, req.body.image, 'base64', function (err1) {
                        if (err1) {
                            console.log(err1);
                            error422(res, "image upload error", err1)
                            return false
                        }
                        success(res, "Image upload seccessfully", fileNameFull);
                    });

                });


            } else {

                error422(res, 'Project setup not found', false);
            }


        });
    } catch (e) {
        console.log(e);
        error501(res);
        return false;
    }
}


/**
 * @description upload json files for metadata for your nft token
 * @param {String} project_id pass the project id . you will get the project id from setup api.
 * @param {String} image_cid pass image CID , you will get the CID from /ipfs/create-car-image in this route
 * @param {Array} meta_objects pass the entire meta object                                                    * @example : [
 *  {
        "description" : "Friendly OpenSea Creature that enjoys long swims in the ocean.",
        "external_url" : "https://example.com/?token_id=1",
        "image" : "https://ipfs.io/ipfs/bafybeifc7cdfac6w7ddwathjlpk752vrtjmy65rgmyrdj6rl5co6qw2rsa/images/1.png",
        "name" : "Sprinkles Fisherton"
    },
    {
        "description" : "Friendly OpenSea Creature that enjoys long swims in the ocean.",
        "external_url" : "https://example.com/?token_id=1",
        "image" : "https://ipfs.io/ipfs/bafybeifc7cdfac6w7ddwathjlpk752vrtjmy65rgmyrdj6rl5co6qw2rsa/images/2.png",
        "name" : "Sprinkles Fisherton"
    }
]
 */
exports.uploadMetaJsonFiles = async (req, res) => {
    const v = new Validator(req.body, {
        project_id: "required",
        image_cid: "required",
        meta_objects: "required|array"
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }

    try {
        exec('ls nfts', (err1, stdout1, stderr1) => {
            if (err1) {
                console.log(err1);
                error422(res, "Cannot check project dir", err1)
                return false
            }

            fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/images/", async (er, files) => {
                if (er) {
                    console.log(er)
                    error422(res, "Cannot count images", er);
                    return false;
                }
                if(files.length != req.body.meta_objects.length){
                    error422(res, "Meta objects error", "Meta array length should be " + files.length);
                    return false;
                }

                let x = 1;
                for(let i of req.body.meta_objects) {
                    if(!i.name || !i.external_url || !i.description || !i.image) {
                        error422(res, "Meta objects error", "Meta object wrong format.");
                        return false;
                    }
                    i.image = "https://ipfs.io/ipfs/"+ req.body.image_cid +"/images/" + i.image + ".png"
                    await fs.writeFile(appRoot + "/nfts/" + req.body.project_id + "/metadata/" + x, JSON.stringify(i), 'utf8', (er,su) => {});
                    x++
                }

                success(res, "Meta files created", true)
            });


        });
        
    } catch (e) {
        console.log(e)
        error501(res)
        return false
    }
}