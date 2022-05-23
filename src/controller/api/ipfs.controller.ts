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



export class IPFS {
    /**
     * @description pack image files into car image
     * @param {String} project_id pass the project id . you will get the image car file CID.
    */
    static async createIpfsCarImage(req: Request, res: Response) {
        const v: any = new Validator(req.body, {
            project_id: "required"
        });

        const match: any = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }


        var projectPath: string = appRoot + "/nfts/" + req.body.project_id
        var projectImagePath: string = appRoot + "/nfts/" + req.body.project_id + "/images"

        try {
            exec('ls nfts', (err1: any, stdout1: any, stderr1: any) => {
                if (err1) {
                    console.log(err1);
                    error422(res, "Cannot check project dir", err1)
                    return false
                }

                var result: any = stdout1.split('\n')
                var dir = result.includes(req.body.project_id);
                if (dir) {

                    // let createImageCarCommand = "npx ipfs-car --pack " + projectImagePath + " --output " + projectPath + "/images.car";
                    let createImageCarCommand: string = "ipfs-car --pack " + projectImagePath + " --output " + projectPath + "/images.car";

                    exec(createImageCarCommand, (err2: any, stdout2: any, stderr2: any) => {
                        if (err2) {
                            console.log(err2);
                            error422(res, "Cannot create image.car file.", err2)
                            return false
                        }
                        var CIDImage: any = stdout2.split('\n')[0].split(':')[1].trim();

                        fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/images/", async (er: any, files: any) => {
                            if (er) {
                                console.log(er)
                                error422(res, "Cannot count images", er);
                                return false;
                            }

                            try {
                                const projectInfo:any = await DI.ProjectInfoRepository.findOne({project_id: req.body.project_id});
                                let uploadImageCarData:any = {
                                    image_cid : CIDImage
                                }
                                wrap(projectInfo).assign(uploadImageCarData);
                                await DI.ProjectInfoRepository.flush();
                                // console.log(projectInfo);
                                
                            } catch (e) {
                                console.log("image cid upload to db error: ", e)
                                error501(res);
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
    static async createIpfsCarMeta(req: Request, res: Response) {
        const v: any = new Validator(req.body, {
            project_id: "required"
        });

        const match: any = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }


        var projectPath: string = appRoot + "/nfts/" + req.body.project_id
        var projectMetaPath: string = appRoot + "/nfts/" + req.body.project_id + "/metadata"

        try {
            exec('ls nfts', (err1: any, stdout1: any, stderr1: any) => {
                if (err1) {
                    console.log(err1);
                    error422(res, "Cannot check project dir", err1)
                    return false
                }

                var result: any = stdout1.split('\n')
                var dir: any = result.includes(req.body.project_id);
                if (dir) {

                    // let createImageCarCommand = "npx ipfs-car --pack " + projectMetaPath + " --output " + projectPath + "/metadata.car";
                    let createImageCarCommand: string = "ipfs-car --pack " + projectMetaPath + " --output " + projectPath + "/metadata.car";

                    exec(createImageCarCommand, async (err2: any, stdout2: any, stderr2: any) => {
                        if (err2) {
                            console.log(err2);
                            error422(res, "Cannot create metadata.car file.", err2)
                            return false
                        }
                        var CIDMeta: string = stdout2.split('\n')[0].split(':')[1].trim();

                        try {
                            const projectInfo:any = await DI.ProjectInfoRepository.findOne({project_id: req.body.project_id});
                            let uploadImageCarData:any = {
                                meta_cid : CIDMeta
                            }
                            wrap(projectInfo).assign(uploadImageCarData);
                            await DI.ProjectInfoRepository.flush();
                            // console.log(projectInfo);
                            
                        } catch (e) {
                            console.log("image cid upload to db error: ", e)
                            error501(res);
                            return false;
                        }

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
    static async uploadCarFiletoIpfs(req: Request, res: Response) {
        const v:any = new Validator(req.body, {
            project_id: "required"
        });

        const match:any = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }


        var projectPath:string = appRoot + "/nfts/" + req.body.project_id
        try {
            exec('ls nfts', async (err1:any, stdout1:any, stderr1:any) => {
                if (err1) {
                    console.log(err1);
                    error422(res, "Cannot check project dir", err1)
                    return false
                }
                var result:any = stdout1.split('\n')
                var dir:any = result.includes(req.body.project_id);
                if (dir) {
                    const resultImage:string = await storeNFT(projectPath + "/images.car")
                    const resultMeta:string = await storeNFT(projectPath + "/metadata.car")
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

}