const express = require('express');
const router = express.Router();
const config = require('../../config/index')
const { success, error422, error501 } = require('../../function/response');
const { Validator } = require('node-input-validator');
const { spawn, execSync, exec } = require('child_process');
var appRoot = require('app-root-path');
const fs = require("fs");

/**
 * @description Deploy your NFT contract with metadata
 * @param {String} project_id pass the project id . you will get the project id from setup api.
 * @param {String} meta_cid pass the meta id . you will get the meta cid from /ipfs/upload-file-to-ipfs this api (as metacar param).
 * @param {String} account_address pass the account address to mint the NFT token
 */
exports.deployNFT = async (req, res) => {
    // validation
    const v = new Validator(req.body, {
        project_id: "required",
        meta_cid: 'required',
        account_address: "required"
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }

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

                let compileCommand = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat compile";
                exec(compileCommand, async (err2, stdout2, stderr2) => {
                    if (err2) {
                        console.log(err2);
                        error422(res, "Cannot compile your project", err2)
                        return false
                    }
                    console.log(stdout2);
                    let deployCommand = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat deploy";
                    exec(deployCommand, async (err3, stdout3, stderr3) => {
                        if (err3) {
                            console.log(err3);
                            error422(res, "Cannot deploy your project", err3)
                            return false
                        }
                        let result1 = stdout3.split('\n').reverse()[1].split(":")[1].trim();
                        console.log("Contract address: ", result1);
                        let projectEnv = appRoot + "/nfts/" + req.body.project_id + "/.env";
                        fs.readFile(projectEnv, 'utf8', function (err, data) {
                            if (err) {
                                return console.log(err);
                            }

                            var result = data.replace("{{{NFT_CONTRACT_ADDRESS}}}", result1);
                            // let envFile = mainDir + "/.env"
                            fs.writeFile(projectEnv, result, 'utf8', async function (err) {
                                if (err) return console.log(err);
                                console.log("NFT_CONTRACT_ADDRESS set to env file.");

                                let setEnvCommand = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; . .env";
                                await exec(setEnvCommand, async (err4, stdout4, stderr4) => {});

                                let setBaseUrlCommand = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat set-base-token-uri --base-url 'https://" + req.body.meta_cid.trim() + ".ipfs.dweb.link/metadata/'";
                                exec(setBaseUrlCommand, async (err4, stdout4, stderr4) => {
                                    if (err4) {
                                        console.log(err4);
                                        error422(res, "Cannot set baseurl your project", err4)
                                        return false
                                    }

                                    await fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/metadata/", async (er, files) => {
                                        if (er) {
                                            console.log(er)
                                            error422(res, "Cannot count images", er);
                                            return false;
                                        }
                                        console.log(files);

                                        for (let i of files) {


                                            let mintCommand = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat mint --address " + req.body.account_address.trim();
                                            await exec(mintCommand, async (err5, stdout5, stderr5) => {
                                                if (err5) {
                                                    console.log(err5);
                                                    // error422(res, "Cannot mint NFT token", err5)
                                                    return false
                                                }
                                                console.log("mint : ", stdout5)

                                                let tokenURICommand = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat token-uri --token-id " + i;
                                                await exec(tokenURICommand, async (err6, stdout6, stderr6) => {
                                                    if (err6) {
                                                        console.log(err6);
                                                        error422(res, "Cannot fetch token with id", err6)
                                                        return false
                                                    }
                                                    console.log("fetch : ", stdout6)
                                                })


                                            })


                                        }
                                        success(res, "Deploy successfully", result1)

                                    })


                                })

                            });
                        })
                    })
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