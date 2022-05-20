import express, { Request, Response, NextFunction } from "express";
import { DI } from '../../app';
import { error422, success, error501 } from '../../functions/response'
const config = require('./../../../config');
import { Validator } from 'node-input-validator';
import { exec } from 'child_process';
const appRoot = require('app-root-path');
import fs from "fs";



export class METADATA {

    /**
     * @description upload images for metadata for your nft
     * @param {String} project_id pass the project id . you will get the project id from setup api.
     * @param {String} image pass base64 formated string for image which you want to upload for your nft metadata
    */
    static async uploadMetaImages(req: Request, res: Response) {
        // validation
        const v: any = new Validator(req.body, {
            project_id: "required",
            image: "required"
        });

        const match: any = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }

        var project_id: string = req.body.project_id
        try {
            exec('ls nfts', async (err: any, stdout: any, stderr: any) => {
                if (err) {
                    console.log(err);
                    error422(res, "Cannot check project dir", err)
                    return false
                }
                var result: any = stdout.split('\n')
                var dir: any = result.includes(project_id);
                if (dir) {
                    //count files
                    await fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/images/", (er: any, files: any) => {
                        if (er) {
                            console.log(er)
                            error422(res, "Cannot count images", er);
                            return false;
                        }
                        // console.log(files.length);   
                        let fileName: number = files.length + 1
                        let fileNameFull: string = fileName + ".png"

                        //upload files
                        fs.writeFile(appRoot + "/nfts/" + req.body.project_id + "/images/" + fileNameFull, req.body.image, 'base64', function (err1: any) {
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
                "image" : "1",
                "name" : "Sprinkles Fisherton"
            },
            {
                "description" : "Friendly OpenSea Creature that enjoys long swims in the ocean.",
                "external_url" : "https://example.com/?token_id=1",
                "image" : "2",
                "name" : "Sprinkles Fisherton"
            }
        ]
    */
    static async uploadMetaJsonFiles(req: Request, res: Response) {
        const v:any = new Validator(req.body, {
            project_id: "required",
            image_cid: "required",
            meta_objects: "required|array"
        });

        const match:any = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }

        try {
            exec('ls nfts', (err1:any, stdout1:any, stderr1:any) => {
                if (err1) {
                    console.log(err1);
                    error422(res, "Cannot check project dir", err1)
                    return false
                }

                fs.readdir(appRoot + "/nfts/" + req.body.project_id + "/images/", async (er:any, files:any) => {
                    if (er) {
                        console.log(er)
                        error422(res, "Cannot count images", er);
                        return false;
                    }
                    if (files.length != req.body.meta_objects.length) {
                        error422(res, "Meta objects error", "Meta array length should be " + files.length);
                        return false;
                    }

                    let x:number = 1;
                    for (let i of req.body.meta_objects) {
                        if (!i.name || !i.external_url || !i.description || !i.image) {
                            error422(res, "Meta objects error", "Meta object wrong format.");
                            return false;
                        }
                        i.image = "https://ipfs.io/ipfs/" + req.body.image_cid + "/images/" + i.image + ".png"
                        await fs.writeFile(appRoot + "/nfts/" + req.body.project_id + "/metadata/" + x, JSON.stringify(i), 'utf8', () => {} );
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
}