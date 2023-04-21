import { Request, Response } from 'express';
import { items, users, PrismaClient } from '@prisma/client';
import { title } from 'process';
import session from 'express-session';

const prisma: PrismaClient = new PrismaClient();

let errUsername = 0;

export class AuthController {

    //LOGIN
    async SignIn(req: Request, res: Response) {
        errUsername = 0;
        const { name, password } = req.body;

        const selectUsername = await prisma.users.findMany({
            where: {
                username: name,
                password: password,
            },
        });

        if (selectUsername.length == 0) {
            req.session.admin = false;
            req.session.auth = false;
            errUsername = 1;
            this.logIn_err(req, res);
        }

        req.session.admin = false;

        const typeUsername = await prisma.users.findMany({
            where: {
                username: name,
                password: password,
                type: "A"
            },
        });

        if(typeUsername.length > 0) {
            req.session.admin = true;
        }

        if (selectUsername.length > 0) {
            errUsername = 0;
            req.session.auth = true;
            this.logIn(req, res);
        }
    }

    logIn(req: Request, res: Response) {
        res.render('pers_acc', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }

    logIn_err(req: Request, res: Response){
        res.render('logIn', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }

    logIn_page(req: Request, res: Response) {
        req.session.admin = false;
        req.session.auth = false;
        errUsername = 0;
        res.render('logIn',
            {
                auth: req.session.auth,
                admin: req.session.admin,
                errUsername: errUsername
            });
    }

    //REGISTRATION
    async SignUp(req: Request, res: Response) {
        errUsername = 0;
        const { name, password } = req.body;
        console.log(name);
        console.log(password);
        const selectUsername = await prisma.users.findMany({
            where: {
                username: name,
            }
        });
        console.log(selectUsername);
        if (selectUsername.length > 0) {
            req.session.admin = false;
            req.session.auth = false;
            errUsername = 1;
            this.reg_err(req, res);
        }

        if (selectUsername.length == 0) {   
            await prisma.users.create({
                data: {
                    username: name,
                    password: password,
                    type: "U"
                }
            });

            req.session.admin = false;
            req.session.auth = true;
            errUsername = 0;
            this.registration(req, res);
        }

    }

    registration(req:Request, res: Response){
        res.render('pers_acc',{
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }

    reg_err(req: Request, res: Response) {
        res.render('registration',{
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }

    reg_page(req: Request, res: Response) {
        req.session.admin = false;
        req.session.auth = false;
        errUsername = 0;
        res.render('registration',
            {
                auth: req.session.auth,
                admin: req.session.admin,
                errUsername: errUsername
            });
    }

    pers_acc(req: Request, res: Response) {
        // console.log(req.session.auth);
        res.render('pers_acc',
            {
                auth: req.session.auth,
                admin: req.session.admin
            });
    }

    logout(req: Request, res: Response) {
        req.session.auth = false;
        req.session.admin = false;
        errUsername = 0;
        res.render('pers_acc',{
            auth: req.session.auth,
            admin: req.session.admin
        });
    }
}