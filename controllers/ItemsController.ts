import { Request, Response } from 'express';
import { items, PrismaClient } from '@prisma/client';
import { type } from 'os';
import multer from 'multer';
import path from 'path';
import * as fs from 'node:fs';
const prisma: PrismaClient = new PrismaClient();

export class ItemsController {

    home(req: Request, res: Response) {
        res.render('home', {
            admin: req.session.admin
        });
    }
    async index(req: Request, res: Response) {
        let numItems = 8;
        let page = Number(req.query.page); // localhost?page=4
        const count = await prisma.items.count({
        })
        let pages = Math.ceil(count / numItems);
        if (!page) page = 1;
        if (page > pages) page = pages;
        const items: items[] = await prisma.items.findMany({
            take: numItems,
            skip: (page - 1) * numItems,
        })
        const categories = await prisma.categories.findMany();

        res.render('items/index', {
            'items': items,
            number: Number(pages),
            categories: categories,
            admin: req.session.admin
        });

    }

    ///!!!!!!!!!!!!!!!!!!
    async category(req: Request, res: Response) {
        let page = Number(req.query.page); // localhost?page=4
        const count = await prisma.items.count({
            where: {
                categ_id: Number(req.params.id)
            }
        });
        let pages = Math.ceil(count / 4);
        if (!page) page = 1;
        if (page > pages) page = pages;
        const items: items[] = await prisma.items.findMany({
            where: {
                categ_id: Number(req.params.id)
            },
            take: 4,
            skip: (page - 1) * 4,
        })
        const categories = await prisma.categories.findMany();
        res.render('items/category', {
            'items': items,
            number: Number(pages),
            categories: categories,
            admin: req.session.admin
        });
    }
    ///!!!!!!!!!!!!!!!!!!

    async show(req: Request, res: Response) {
        let favState = 0;
        if (!Number(req.params.id)) {
            res.redirect('/items');
        }
        if (Number(req.params.id)) {
            const item = await prisma.items.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
            if (!req.session.username) favState = 0;

            if (req.session.username) {
                const userId = await prisma.users.findMany({
                    where: {
                        username: req.session.username,
                    }
                });

                const favoritStatus = await prisma.favorites.findMany({
                    where: {
                        userId: Number(userId[0].id),
                        itemId: Number(req.params.id),
                    }
                });

                if (favoritStatus.length > 0) favState = 2;
                if (favoritStatus.length == 0) favState = 1;

            }
            const categories = await prisma.categories.findMany();

            const comments = await prisma.comments.findMany({
                where: {
                    item_id: Number(req.params.id),
                }
            });

            res.render('items/show', {
                favoritStatus: favState,
                'item': item,
                categories: categories,
                admin: req.session.admin,
                user: req.session.username,
                'comment': comments,
            });
        }
    }

    async createCategPage(req: Request, res: Response) {
        const categories = await prisma.categories.findMany();

        res.render('categories/create', {
            categories: categories,
            admin: req.session.admin,
        });
    }

    async createCateg(req: Request, res: Response) {
        const { title } = req.body;

        await prisma.categories.create({
            data: {
                title,
            }
        });
        // const categories = await prisma.categories.findMany();

        res.redirect('/items');
    }

    async create(req: Request, res: Response) {
        if (req.session.admin) {
            const categories = await prisma.categories.findMany();
            res.render('items/create', {
                categories: categories,
                admin: req.session.admin
            });
        } else {
            res.redirect('/');
        }
    }

    ///!!!!!!!!!!!!!!!!!!
    async store(req: Request, res: Response) {
        const { title, categ_id, description } = req.body;
        await prisma.items.create({
            data: {
                title,
                image: String(req.file?.originalname),
                category: {
                    connect: {
                        id: Number(categ_id)
                    }
                },
                description,
            }
        });

        res.redirect('/items');
    }
    ///!!!!!!!!!!!!!!!!!!
    async destroy(req: Request, res: Response) {
        const { id, image } = req.body;
        await prisma.items.deleteMany({
            where: {
                id: Number(id)
            }
        });
        res.redirect('/');
    }

    async update(req: Request, res: Response) {
        const { id, title, categ_id, description } = req.body;
        await prisma.items.update({
            where: {
                id: Number(id),
            },
            data: {
                title,
                image: String(req.file?.originalname),
                category: {
                    connect: {
                        id: Number(categ_id)
                    }
                },
                description,
            }
        });

        res.redirect('/items');
    }

    //Поиск книг
    async searchItem(req: Request, res: Response) {
        console.log("______");
        const { title } = req.body;
        console.log(title);
        const items = await prisma.items.findMany({
            where: {
                title: {
                    contains: String(title),
                },
            },
        });

        console.log(items);
        const categories = await prisma.categories.findMany();

        res.render('items/index', {
            'items': items,
            number: 1,
            categories: categories,
            admin: req.session.admin
        });
    }
}