import express, { Request, Response, NextFunction } from "express";
import { DI } from '../../app';
import { wrap } from '@mikro-orm/core';
import { error422, success, error501 } from '../../functions/response'
const config = require('./../../../config');
import { Validator } from 'node-input-validator';
import { getLTSVersion, fileFromPath, storeNFT } from './../../functions/common';
const { exec } = require('child_process');
const appRoot = require('app-root-path');
import fs from "fs";



export class DEPLOY {
    /**
     * @description Deploy your NFT contract with metadata
     * @param {String} project_id pass the project id . you will get the project id from setup api.
     * @param {String} account_address pass the account address to mint the NFT token
    */
    static async deployNFT(req: Request, res: Response) {
        // validation
        const v: any = new Validator(req.body, {
            project_id: "required",
            // meta_cid: 'required',
            // account_address: "required"
        });

        const match = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }

        try {
            const projectInfo: any = await DI.ProjectInfoRepository.findOne({ project_id: req.body.project_id });
            req.body.meta_cid = projectInfo.meta_cid
            req.body.account_address = projectInfo.account_address
            console.log(projectInfo);
        } catch (e) {
            console.log(e)
            error501(res);
            return false;
        }
        

        // console.log(req.body.meta_cid);
        // return false;
        
        

        try {
            exec('ls nfts', async (err1: any, stdout1: any, stderr1: any) => {
                if (err1) {
                    console.log(err1);
                    error422(res, "Cannot check project dir", err1)
                    return false
                }
                var results: any = stdout1.split('\n')
                var dir: any = results.includes(req.body.project_id);
                if (dir) {

                    let compileCommand: string = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat compile";
                    exec(compileCommand, async (err2: any, stdout2: any, stderr2: any) => {
                        if (err2) {
                            console.log(err2);
                            error422(res, "Cannot compile your project", err2)
                            return false
                        }
                        console.log(stdout2);
                        let deployCommand: string = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat deploy";
                        exec(deployCommand, async (err3: any, stdout3: any, stderr3: any) => {
                            if (err3) {
                                console.log(err3);
                                error422(res, "Cannot deploy your project", err3)
                                return false
                            }
                            let result1: any = stdout3.split('\n').reverse()[1].split(":")[1].trim();
                            console.log("Contract address: ", result1);
                            let projectEnv: string = appRoot + "/nfts/" + req.body.project_id + "/.env";
                            fs.readFile(projectEnv, 'utf8', function (err: any, data: any) {
                                if (err) {
                                    return console.log(err);
                                }

                                var result: any = data.replace("{{{NFT_CONTRACT_ADDRESS}}}", result1);
                                // let envFile = mainDir + "/.env"
                                fs.writeFile(projectEnv, result, 'utf8', async function (err: any) {
                                    if (err) return console.log(err);
                                    console.log("NFT_CONTRACT_ADDRESS set to env file.");

                                    let setEnvCommand: string = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; . .env";
                                    await exec(setEnvCommand, async (err4: any, stdout4: any, stderr4: any) => { });

                                    let setBaseUrlCommand: string = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat set-base-token-uri --base-url 'https://" + req.body.meta_cid.trim() + ".ipfs.dweb.link/metadata/' --contract-address " + result1;
                                    console.log("set baseurl : ", setBaseUrlCommand);
                                    
                                    exec(setBaseUrlCommand, async (err4: any, stdout4: any, stderr4: any) => {
                                        if (err4) {
                                            console.log(err4);
                                            error422(res, "Cannot set baseurl your project", err4)
                                            return false
                                        }

                                        console.log("set base url : ", stdout4);

                                        await fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/metadata/", async (er: any, files: any) => {
                                            if (er) {
                                                console.log(er)
                                                error422(res, "Cannot count images", er);
                                                return false;
                                            }
                                            console.log(files);

                                            for (let i of files) {


                                                let mintCommand: string = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat mint --address " + req.body.account_address.trim() + " --contract-address " + result1;
                                                await exec(mintCommand, async (err5: any, stdout5: any, stderr5: any) => {
                                                    if (err5) {
                                                        console.log(err5);
                                                        // error422(res, "Cannot mint NFT token", err5)
                                                        return false
                                                    }
                                                    console.log("mint : ", stdout5)

                                                    let tokenURICommand: string = "cd " + appRoot + "/nfts/" + req.body.project_id + " ; npx hardhat token-uri --token-id " + i;
                                                    await exec(tokenURICommand, async (err6: any, stdout6: any, stderr6: any) => {
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
}