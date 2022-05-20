import express, { Request, Response, NextFunction } from "express";
import { DI } from '../../app';
import { error422, success, error501 } from '../../functions/response'

export class SETUP {

    // static async insert(req: Request, res: Response) {

    //     try {
    //         let data:any = {
    //             name : "sumit",
    //             email : "hello@info.com",
    //             age : 12
    //         }
    //         req.body.name = "sumit";
    //         req.body.email = "sumit@yopmail.co";
    //         req.body.age = 28;
    //         const author = DI.testRepository.create(data);
    //         await DI.testRepository.persist(author).flush();
    //         success(res, "success", author);
    //     } catch (e) {
    //         console.log(e);
    //         error501(res);
    //     }
    // }

}