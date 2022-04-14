const express = require('express');
const router = express.Router();
const config = require('../../config/index')
const { success, error422, error501 } = require('../../function/response');
const { Validator } = require('node-input-validator');
const { spawn, execSync, exec } = require('child_process');

exports.installSetup = async (req, res) => {
    var project_id = "NFT_1649940569020";
    exec('npm i --prefix nfts/' + project_id , (err1, stdout1, stderr1) => {
        if(err1) return err1;
        console.log(stdout1);

    });

}