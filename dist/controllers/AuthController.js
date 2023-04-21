"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let errUsername = 0;
class AuthController {
    //LOGIN
    SignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            errUsername = 0;
            const { name, password } = req.body;
            const selectUsername = yield prisma.users.findMany({
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
            const typeUsername = yield prisma.users.findMany({
                where: {
                    username: name,
                    password: password,
                    type: "A"
                },
            });
            if (typeUsername.length > 0) {
                req.session.admin = true;
            }
            if (selectUsername.length > 0) {
                errUsername = 0;
                req.session.auth = true;
                this.logIn(req, res);
            }
        });
    }
    logIn(req, res) {
        res.render('pers_acc', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }
    logIn_err(req, res) {
        res.render('logIn', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }
    logIn_page(req, res) {
        req.session.admin = false;
        req.session.auth = false;
        errUsername = 0;
        res.render('logIn', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }
    //REGISTRATION
    SignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            errUsername = 0;
            const { name, password } = req.body;
            console.log(name);
            console.log(password);
            const selectUsername = yield prisma.users.findMany({
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
                yield prisma.users.create({
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
        });
    }
    registration(req, res) {
        res.render('pers_acc', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }
    reg_err(req, res) {
        res.render('registration', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }
    reg_page(req, res) {
        req.session.admin = false;
        req.session.auth = false;
        errUsername = 0;
        res.render('registration', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
    }
    pers_acc(req, res) {
        // console.log(req.session.auth);
        res.render('pers_acc', {
            auth: req.session.auth,
            admin: req.session.admin
        });
    }
    logout(req, res) {
        req.session.auth = false;
        req.session.admin = false;
        errUsername = 0;
        res.render('pers_acc', {
            auth: req.session.auth,
            admin: req.session.admin
        });
    }
}
exports.AuthController = AuthController;
