const express = require('express');
const router = express.Router();
const config = require('../../config/index')
const { success, error422, error501 } = require('../../function/response');
const { Validator } = require('node-input-validator');
const { spawn, execSync, exec } = require('child_process');


/**
 * @description install node modules and basic setup for project directory. after this installation you are ready to go.
 * @param {String} project_id pass the project id . you will get the project id from setup api.
 */
exports.installSetup = async (req, res) => {

    // validation
    const v = new Validator(req.body, {
        project_id: "required"
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }


    var project_id = req.body.project_id.replace(/ /g, "");
    let result;
    exec('ls nfts', (err1, stdout1, stderr1) => {
        if (err1) {
            console.log(err1);
            error422(res,"Cannot check project dir", err1)
            return false
        }
        result = stdout1.split('\n')
        var dir = result.includes(project_id);
        if (dir) {
            console.log("installing node modules");
            exec('npm i --prefix nfts/' + project_id , (err2, stdout2, stderr2) => {
                if (err2) {
                    console.log(err2);
                    error422(res,"Cannot install node module", err2)
                    return false
                }
                success(res, "Installation successfully", true);
            });
        } else {
            console.log("directory not found");
            error422(res, 'Project setup not found', false);
        }


    });

}