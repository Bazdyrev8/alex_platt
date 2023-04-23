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
            const { username, password } = req.body;
            req.session.username = username;
            const selectUsername = yield prisma.users.findMany({
                where: {
                    username: username,
                    password: password,
                },
            });
            if (selectUsername.length == 0) {
                req.session.admin = false;
                req.session.auth = false;
                errUsername = 1;
                this.logIn_page(req, res);
            }
            req.session.admin = false;
            const typeUsername = yield prisma.users.findMany({
                where: {
                    username: username,
                    password: password,
                    type: "A"
                },
            });
            if (typeUsername.length > 0) {
                req.session.admin = true;
                req.session.username = username;
            }
            if (selectUsername.length > 0) {
                req.session.username = username;
                req.session.password = password;
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
            username: req.session.username,
            password: req.session.password,
            errUsername: errUsername
        });
    }
    // logIn_err(req: Request, res: Response) {
    //     res.render('logIn', {
    //         auth: req.session.auth,
    //         admin: req.session.admin,
    //         username: req.session.username,
    //         errUsername: errUsername
    //     });
    // }
    logIn_page(req, res) {
        req.session.admin = false;
        req.session.auth = false;
        res.render('logIn', {
            auth: req.session.auth,
            admin: req.session.admin,
            username: req.session.username,
            errUsername: errUsername
        });
        errUsername = 0;
    }
    //REGISTRATION
    SignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            errUsername = 0;
            const { username, password } = req.body;
            const selectUsername = yield prisma.users.findMany({
                where: {
                    username: username,
                }
            });
            console.log(selectUsername);
            if (selectUsername.length > 0) {
                req.session.admin = false;
                req.session.auth = false;
                errUsername = 1;
                this.reg_page(req, res);
            }
            if (selectUsername.length == 0) {
                yield prisma.users.create({
                    data: {
                        username: username,
                        password: password,
                        type: "U"
                    }
                });
                req.session.username = username;
                req.session.password = password;
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
            username: req.session.username,
            password: req.session.password,
            errUsername: errUsername
        });
    }
    // reg_err(req: Request, res: Response) {
    //     res.render('registration', {
    //         auth: req.session.auth,
    //         admin: req.session.admin,
    //         errUsername: errUsername
    //     });
    // }
    reg_page(req, res) {
        req.session.admin = false;
        req.session.auth = false;
        res.render('registration', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername
        });
        errUsername = 0;
    }
    //UPDATE_PASSWORD
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            errUsername = 0;
            const { currentPassword, newPassword } = req.body;
            const selectUsernamePassword = yield prisma.users.findMany({
                where: {
                    username: req.session.username,
                    password: currentPassword,
                }
            });
            if (selectUsernamePassword.length == 0) {
                errUsername = 11;
                this.pers_acc(req, res);
            }
            if (selectUsernamePassword.length > 0) {
                const idUser_updatePassword = selectUsernamePassword[0].id;
                yield prisma.users.update({
                    where: {
                        id: idUser_updatePassword,
                    },
                    data: {
                        password: newPassword,
                    }
                });
                errUsername = 12;
                this.pers_acc(req, res);
            }
        });
    }
    destroyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            errUsername = 0;
            const { currentPassword } = req.body;
            const selectUsernamePassword = yield prisma.users.findMany({
                where: {
                    username: req.session.username,
                    password: currentPassword,
                }
            });
            if (selectUsernamePassword.length == 0) {
                errUsername = 21;
                this.pers_acc(req, res);
            }
            if (selectUsernamePassword.length > 0) {
                const idUser_updatePassword = selectUsernamePassword[0].id;
                yield prisma.users.deleteMany({
                    where: {
                        id: idUser_updatePassword,
                    },
                });
                errUsername = 0;
                req.session.auth = false;
                req.session.admin = false;
                // ???????????
                // req.session.username = "";
                // req.session.password = "";
                // ???????????
                this.pers_acc(req, res);
            }
        });
    }
    pers_acc(req, res) {
        if (req.session.auth == true) {
            res.render('pers_acc', {
                auth: req.session.auth,
                admin: req.session.admin,
                username: req.session.username,
                errUsername: errUsername,
            });
            errUsername = 0;
        }
        else {
            this.logIn_page(req, res);
        }
    }
    logout(req, res) {
        req.session.auth = false;
        req.session.admin = false;
        errUsername = 0;
        this.logIn_page(req, res);
    }
    createAdminAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            errUsername = 0;
            const { username, password } = req.body;
            const selectUsername = yield prisma.users.findMany({
                where: {
                    username: username,
                }
            });
            if (selectUsername.length > 0) {
                errUsername = 1;
            }
            if (selectUsername.length == 0) {
                yield prisma.users.create({
                    data: {
                        username: username,
                        password: password,
                        type: "A"
                    }
                });
                errUsername = 0;
            }
            req.session.admin = true;
            req.session.auth = true;
            this.createAdmin(req, res);
        });
    }
    createAdmin(req, res) {
        res.render('create_admin', {
            auth: req.session.auth,
            admin: req.session.admin,
            errUsername: errUsername,
        });
        errUsername = 0;
    }
}
exports.AuthController = AuthController;
