import express, { Request, Response, NextFunction } from "express";
import { DI } from '../../app';
import { error422, success, error501 } from '../../functions/response'
const config = require('./../../../config');
import { Validator } from 'node-input-validator';
import { exec } from 'child_process';



export class INSATLL {

    /**
     * @description install node modules and basic setup for project directory. after this installation you are ready to go.
     * @param {String} project_id pass the project id . you will get the project id from setup api.
    */
    static async installSetup(req: Request, res: Response) {
        // validation
        const v:any = new Validator(req.body, {
            project_id: "required"
        });

        const match:any = await v.check();
        if (!match) {
            error422(res, "Validation error", v.errors)
            return false;
        }

        var project_id:string = req.body.project_id.replace(/ /g, "");
        let result:any;
        exec('ls nfts', (err1:any, stdout1:any, stderr1:any) => {
            if (err1) {
                console.log(err1);
                error422(res, "Cannot check project dir", err1)
                return false
            }

            result = stdout1.split('\n')
            var dir:any = result.includes(project_id);
            if (dir) {
                console.log("installing node modules");
                exec('npm i --prefix nfts/' + project_id, (err2:any, stdout2:any, stderr2:any) => {
                    if (err2) {
                        console.log(err2);
                        error422(res, "Cannot install node module", err2)
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

}