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
        const { username, password } = req.body;
        req.session.username = username;
        const selectUsername = await prisma.users.findMany({
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

        const typeUsername = await prisma.users.findMany({
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
    }

    logIn(req: Request, res: Response) {
        res.render('pers_acc', {
            auth: req.session.auth,
            admin: req.session.admin,
            username: req.session.username,
            password: req.session.password,
            errUsername: errUsername
        });
    }

    logIn_page(req: Request, res: Response) {
        req.session.admin = false;
        req.session.auth = false;
        res.render('logIn',
            {
                auth: req.session.auth,
                admin: req.session.admin,
                username: req.session.username,
                errUsername: errUsername
            });
        errUsername = 0;
    }

    //REGISTRATION
    async SignUp(req: Request, res: Response) {
        errUsername = 0;
        const { username, password } = req.body;
        const selectUsername = await prisma.users.findMany({
            where: {
                username: username,
            }
        });
        if (selectUsername.length > 0) {
            req.session.admin = false;
            req.session.auth = false;
            errUsername = 1;
            this.reg_page(req, res);
        }

        if (selectUsername.length == 0) {
            await prisma.users.create({
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

    }

    registration(req: Request, res: Response) {
        res.render('pers_acc', {
            auth: req.session.auth,
            admin: req.session.admin,
            username: req.session.username,
            password: req.session.password,
            errUsername: errUsername
        });
    }

    reg_page(req: Request, res: Response) {
        req.session.admin = false;
        req.session.auth = false;

        res.render('registration',
            {
                auth: req.session.auth,
                admin: req.session.admin,
                errUsername: errUsername
            });
        errUsername = 0;
    }

    //UPDATE_PASSWORD

    async updatePassword(req: Request, res: Response) {
        errUsername = 0;
        const { currentPassword, newPassword } = req.body;
        const selectUsernamePassword = await prisma.users.findMany({
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

            await prisma.users.update({
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
    }

    async destroyAccount(req: Request, res: Response) {
        errUsername = 0;
        const { currentPassword } = req.body;
        const selectUsernamePassword = await prisma.users.findMany({
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

            await prisma.users.deleteMany({
                where: {
                    id: idUser_updatePassword,
                },
            });

            errUsername = 0;
            req.session.auth = false;
            req.session.admin = false;
            this.pers_acc(req, res);
        }
    }

    pers_acc(req: Request, res: Response) {
        if (req.session.auth == true) {
            res.render('pers_acc',
                {
                    auth: req.session.auth,
                    admin: req.session.admin,
                    username: req.session.username,
                    errUsername: errUsername,
                });
            errUsername = 0;
        } else {
            this.logIn_page(req, res);
        }
    }


    logout(req: Request, res: Response) {
        req.session.auth = false;
        req.session.admin = false;
        req.session.username = undefined;
        errUsername = 0;
        this.logIn_page(req, res);
    }

    // CREATEAdminAccount

    async createAdminAccount(req: Request, res: Response) {
        errUsername = 0;
        const { username, password } = req.body;

        const selectUsername = await prisma.users.findMany({
            where: {
                username: username,
            }
        });

        if (selectUsername.length > 0) {
            errUsername = 1;
        }

        if (selectUsername.length == 0) {
            await prisma.users.create({
                data: {
                    username: username,
                    password: password,
                    type: "A"
                }
            });
            errUsername = 0;
        }

        this.createAdmin(req, res);
    }

    createAdmin(req: Request, res: Response) {
        if (req.session.admin == true) {
            res.render('create_admin',
                {
                    auth: req.session.auth,
                    admin: req.session.admin,
                    errUsername: errUsername,
                });
        } else {
            res.redirect('/');
        }
        errUsername = 0;
    }

    // AddToFavorites

    async toFavorites(req: Request, res: Response) {
        const { id } = req.body;
        const userId = await prisma.users.findMany({
            where: {
                username: req.session.username,
            }
        });

        const exisfavorites = await prisma.favorites.findMany({
            where: {
                userId: Number(userId[0].id),
                itemId: Number(id),
            }
        });

        if (exisfavorites.length == 0) {
            await prisma.favorites.create({
                data: {
                    userId: userId[0].id,
                    itemId: Number(id),
                }
            })
        }

        res.redirect('/items');
    }

    async viewFavorites(req: Request, res: Response) {
        if (!req.session.username) {
            res.redirect('/items');
        }

        const userId = await prisma.users.findMany({
            where: {
                username: req.session.username,
            }
        });

        const favorites = await prisma.users.findMany({
            where: {
                id: Number(userId[0].id),
            },
            select: {
                favorites: {
                    select: {
                        item: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });
        let arr = [];
        for (let i = 0; i < favorites[0].favorites.length; i++) {
            arr.push(favorites[0].favorites[i].item.id)
        };
        const items = await prisma.items.findMany({
            where: {
                id: {
                    in: arr,
                }
            }
        });

        const categories = await prisma.categories.findMany({});

        res.render('items/favorites',
            {
                auth: req.session.auth,
                admin: req.session.admin,
                'categories': categories,
                'items': items,
            });
    }

    async deleteFavorit(req: Request, res: Response) {
        const { id } = req.body;

        const userId = await prisma.users.findMany({
            where: {
                username: req.session.username,
            }
        });

        const exisfavorites = await prisma.favorites.findMany({
            where: {
                userId: Number(userId[0].id),
                itemId: Number(id),
            }
        });

        if (exisfavorites.length != 0) {
            await prisma.favorites.deleteMany({
                where: {
                    userId: Number(userId[0].id),
                    itemId: Number(id),
                }
            });
        }

        res.redirect('/items');


    }

}