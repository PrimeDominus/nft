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
        image: "required",
        image_name: "required",
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }

    var project_id = req.body.project_id
    try {
        exec('ls nfts', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                error422(res,"Cannot check project dir", err)
                return false
            }
            result = stdout.split('\n')
            var dir = result.includes(project_id);
            if (dir) {
                fs.writeFile(appRoot + "/nfts/" + req.body.project_id + "/images/" + req.body.image_name, req.body.image, 'base64', function(err1) {
                    if (err1) {
                        console.log(err1);
                        error422(res,"image upload error", err1)
                        return false
                    }
                    success(res, "Image upload seccessfully", true);
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