const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const config = require('../../config/index')
const { success, error422, error501 } = require('../../function/response');
const { getLTSVersion } = require('../../function/common');
const { Validator } = require('node-input-validator');
const fs = require("fs");
var appRoot = require('app-root-path');
const packageJson = require('package-json');

/**
 * @description create base structure for nft, it will create all necessary files and folder for deploy and NFT token
 * @param {String} project_name name of the project
 * @param {String} project_description name of the project (optional parameter)
 * @param {String} author author of the project (optional parameter)
 * @param {String} alchemy_key pass alchemy key here
 * @param {String} account_private_key pass crypto account private key here
 * @param {String} etherscan_api_key pass etherscan api key here
 * @param {Number} mint_price pass mint price here
 */
exports.createNFTStructure = async (req, res) => {

    // validation
    const v = new Validator(req.body, {
        project_name: "required",
        alchemy_key : "required",
        account_private_key : "required",
        etherscan_api_key : "required",
        mint_price : "required",
    });

    const match = await v.check();
    if (!match) {
        error422(res, "Validation error", v.errors)
        return false;
    }

    // create directories
    var mainDir = appRoot + "/nfts/" + req.body.project_name + "_" + new Date().getTime();
    var contractsDir = mainDir + "/" + "contracts";
    var imagesDir = mainDir + "/" + "images";
    var metadataDir = mainDir + "/" + "metadata";
    var scriptsDir = mainDir + "/" + "scripts";

    try {
        await fs.mkdir(mainDir, { recursive: true }, () => {});
        await fs.mkdir(contractsDir, { recursive: true }, () => {});
        await fs.mkdir(imagesDir, { recursive: true }, () => {});
        await fs.mkdir(metadataDir, { recursive: true }, () => {});
        await fs.mkdir(scriptsDir, { recursive: true }, () => {});
    } catch (e) {
        error501(res);
        console.log(e)
        return false;
    }


    // create hardhat config file
    try {
        let sampleHardhatFile = appRoot + "/sample_files/hardhat.config.js";
        fs.readFile(sampleHardhatFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var result = data.replace("{{{NETWORK}}}" , config.NETWORK);
            let hardhatConfigFile = mainDir + "/hardhat.config.js";

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
        let sampleEnv = appRoot + "/sample_files/.env";
        fs.readFile(sampleEnv, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var result = data.replace("{{{ALCHEMY_KEY}}}" , req.body.alchemy_key).replace("{{{ACCOUNT_PRIVATE_KEY}}}" , req.body.account_private_key).replace("{{{ETHERSCAN_API_KEY}}}" , req.body.etherscan_api_key).replace("{{{NETWORK}}}" , config.NETWORK);
            // console.log(result)z

            let envFile = mainDir + "/.env"
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
        let sampleSolFile = appRoot + "/sample_files/NFT.sol";
        fs.readFile(sampleSolFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var result = data.replace("{{{NAME}}}" , req.body.project_name).replace("{{{MINT_PRICE}}}" , req.body.mint_price)
            // console.log(result)

            let solFile = mainDir + "/contracts/NFT.sol"
            fs.writeFile(solFile, result, 'utf8', function (err) {
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
        let sampleDeployFile = appRoot + "/sample_files/deploy.js";
        fs.readFile(sampleDeployFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            // console.log(data)

            let deployFile = mainDir + "/scripts/deploy.js"
            fs.writeFile(deployFile, data, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });

        let sampleHelperFile = appRoot + "/sample_files/helpers.js";
        fs.readFile(sampleHelperFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            // console.log(data)

            let helpersFile = mainDir + "/scripts/helpers.js"
            fs.writeFile(helpersFile, data, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });

        let sampleMintFile = appRoot + "/sample_files/mint.js";
        fs.readFile(sampleMintFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            // console.log(data);

            let mintFile = mainDir + "/scripts/mint.js"
            fs.writeFile(mintFile, data, 'utf8', function (err) {
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
        let samplePackageJsonFile = require(appRoot + "/sample_files/package.json");

        samplePackageJsonFile.name = req.body.project_name;
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
        samplePackageJsonFile["devDependencies"]["node-fetch"] = "^" + nodeFetchVersion.version

        // console.log(samplePackageJsonFile);
        let packageJsonFile = mainDir + "/package.json";
        fs.writeFile(packageJsonFile, JSON.stringify(samplePackageJsonFile), 'utf8', function (err) {
            if (err) return console.log(err);
        });
    } catch (e) {
        error501(res);
        console.log(e);
        return false;
    }

    success(res, 'Success', "project directory created");

}