import express, { Request, Response, NextFunction } from "express";
import { DI } from '../../app';
import { error422, success, error501 } from '../../functions/response'
const config = require('./../../../config');
import { Validator } from 'node-input-validator';
import fs from "fs";
const appRoot = require('app-root-path');
import packageJson from 'package-json';
import { getLTSVersion } from './../../functions/common';



export class SETUP {

    /**
     * @description create base structure for nft, it will create all necessary files and folder for deploy and NFT token
     * @param {String} project_name name of the project
     * @param {String} project_description name of the project (optional parameter)
     * @param {String} author author of the project (optional parameter)
     * @param {String} alchemy_key pass alchemy key here
     * @param {String} account_private_key pass crypto account private key here
     * @param {String} etherscan_api_key pass etherscan api key here
     * @param {String} account_address pass your account address here
     */
    static async makeProjectSetup(req: Request, res: Response) {
        // validation
        const v:any = new Validator(req.body, {
            project_name: "required",
            alchemy_key: "required",
            account_private_key: "required",
            etherscan_api_key: "required",
            // mint_price : "required",
            account_address : "required"
        });

        const match:any = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }

        // create directories
        var project_name:string = req.body.project_name.replace(/ /g, "") + "_" + new Date().getTime();
        var mainDir:string = appRoot + "/nfts/" + project_name;
        var contractsDir:string = mainDir + "/" + "contracts";
        var imagesDir:string = mainDir + "/" + "images";
        var metadataDir:string = mainDir + "/" + "metadata";
        var scriptsDir:string = mainDir + "/" + "scripts";      

        try {
            await fs.mkdir(mainDir, { recursive: true }, () => { });
            await fs.mkdir(contractsDir, { recursive: true }, () => { });
            await fs.mkdir(imagesDir, { recursive: true }, () => { });
            await fs.mkdir(metadataDir, { recursive: true }, () => { });
            await fs.mkdir(scriptsDir, { recursive: true }, () => { });
        } catch (e) {
            error501(res);
            console.log(e)
            return false;
        }


        // create hardhat config file
        try {
            let sampleHardhatFile:string = appRoot + "/sample_files/hardhat.config.js";
            fs.readFile(sampleHardhatFile, 'utf8', function (err:any, data:any) {
                if (err) {
                    return console.log(err);
                }

                var result:any = data.replace("{{{NETWORK}}}", config.NETWORK);
                let hardhatConfigFile:string = mainDir + "/hardhat.config.js";

                fs.writeFile(hardhatConfigFile, result, 'utf8', function (err1) {
                    if (err1) return console.log(err1);
                });
            });
        } catch (e) {
            error501(res);
            console.log(e)
            return false;
        }

        //create .env file
        try {
            let sampleEnv:string = appRoot + "/sample_files/.env";
            fs.readFile(sampleEnv, 'utf8', function (err:any, data:any) {
                if (err) {
                    return console.log(err);
                }

                var result:any = data.replace("{{{ALCHEMY_KEY}}}", req.body.alchemy_key).replace("{{{ACCOUNT_PRIVATE_KEY}}}", req.body.account_private_key).replace("{{{ETHERSCAN_API_KEY}}}", req.body.etherscan_api_key).replace("{{{NETWORK}}}", config.NETWORK);
                // console.log(result)z

                let envFile:string = mainDir + "/.env"
                fs.writeFile(envFile, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
        } catch (e) {
            error501(res);
            console.log(e)
            return false;
        }


        //create solidity file
        try {
            let sampleSolFile:string = appRoot + "/sample_files/NFT.sol";
            fs.readFile(sampleSolFile, 'utf8', function (err:any, data:any) {
                if (err) {
                    return console.log(err);
                }

                var result:any = data.replace("{{{NAME}}}", req.body.project_name)
                //.replace("{{{MINT_PRICE}}}" , req.body.mint_price)
                // console.log(result)

                let solFile = mainDir + "/contracts/NFT.sol"
                fs.writeFile(solFile, result, 'utf8', function (err:any) {
                    if (err) return console.log(err);
                });
            });
        } catch (e) {
            error501(res);
            console.log(e)
            return false;
        }


        //create deploy.js file
        //create helpers.js file
        //create mint.js file
        try {
            let sampleDeployFile:string = appRoot + "/sample_files/deploy.js";
            fs.readFile(sampleDeployFile, 'utf8', function (err:any, data:any) {
                if (err) {
                    return console.log(err);
                }
                // console.log(data)

                let deployFile:string = mainDir + "/scripts/deploy.js"
                fs.writeFile(deployFile, data, 'utf8', function (err:any) {
                    if (err) return console.log(err);
                });
            });

            let sampleHelperFile:string = appRoot + "/sample_files/helpers.js";
            fs.readFile(sampleHelperFile, 'utf8', function (err:any, data:any) {
                if (err) {
                    return console.log(err);
                }
                // console.log(data)

                let helpersFile:string = mainDir + "/scripts/helpers.js"
                fs.writeFile(helpersFile, data, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });

            let sampleMintFile:string = appRoot + "/sample_files/mint.js";
            fs.readFile(sampleMintFile, 'utf8', function (err:any, data:any) {
                if (err) {
                    return console.log(err);
                }
                // console.log(data);

                let mintFile:string = mainDir + "/scripts/mint.js"
                fs.writeFile(mintFile, data, 'utf8', function (err:any) {
                    if (err) return console.log(err);
                });
            });
        } catch (e) {
            error501(res);
            console.log(e)
            return false;
        }

        //create package json file
        try {
            let samplePackageJsonFile:any = require(appRoot + "/sample_files/package.json");

            samplePackageJsonFile.name = req.body.project_name.replace(/ /g, "-");
            samplePackageJsonFile.description = req.body.project_description ? req.body.project_description : "NFT Creation";
            samplePackageJsonFile.author = req.body.author ? req.body.author : "";

            //select latest version for package.json file
            let openzeppelinVersion = await getLTSVersion("@openzeppelin/contracts");
            samplePackageJsonFile["dependencies"]["@openzeppelin/contracts"] = "^" + openzeppelinVersion.version

            let dotenvVersion = await getLTSVersion("dotenv")
            samplePackageJsonFile["dependencies"]["dotenv"] = "^" + dotenvVersion.version

            let hardhatEtherVersion = await getLTSVersion("@nomiclabs/hardhat-ethers")
            samplePackageJsonFile["devDependencies"]["@nomiclabs/hardhat-ethers"] = "^" + hardhatEtherVersion.version

            let hardhatEtherScanVersion = await getLTSVersion("@nomiclabs/hardhat-etherscan")
            samplePackageJsonFile["devDependencies"]["@nomiclabs/hardhat-etherscan"] = "^" + hardhatEtherScanVersion.version

            let ethersVersion = await getLTSVersion("ethers")
            samplePackageJsonFile["devDependencies"]["ethers"] = "^" + ethersVersion.version

            let hardhatVersion = await getLTSVersion("hardhat")
            samplePackageJsonFile["devDependencies"]["hardhat"] = "^" + hardhatVersion.version

            let nodeFetchVersion = await getLTSVersion("node-fetch")
            samplePackageJsonFile["devDependencies"]["node-fetch"] = "^2.6.7" //+ nodeFetchVersion.version

            // console.log(samplePackageJsonFile);
            let packageJsonFile:string = mainDir + "/package.json";
            fs.writeFile(packageJsonFile, JSON.stringify(samplePackageJsonFile), 'utf8', function (err:any) {
                if (err) return console.log(err);
            });
        } catch (e) {
            error501(res);
            console.log(e);
            return false;
        }

        var project_id:string = project_name.replace(/ /g, "");

        try {
            var data:any = {
                project_id: project_id,
                account_address : req.body.account_address
            }
            const project = DI.ProjectInfoRepository.create(data);
            await DI.ProjectInfoRepository.persist(project).flush();
        } catch (e) {
            error501(res);
            console.log(e);
            return false;
        }

        success(res, 'Success', { msg: "project directory created", project_id: project_id });
    }

}