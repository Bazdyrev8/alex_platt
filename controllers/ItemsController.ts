import { Request, Response } from 'express';
import { items, PrismaClient } from '@prisma/client';
import { type } from 'os';
import multer from 'multer'; 
import path from 'path';
const fs = require('fs');
const prisma: PrismaClient = new PrismaClient();

export class ItemsController {

    home(req: Request, res: Response) {
        res.render('home', {
            admin: req.session.admin
        });
    }
    async index(req: Request, res: Response) {
        let page = Number(req.query.page); // localhost?page=4
        const count = await prisma.items.count({
        })
        let pages = Math.ceil(count / 4);
        if (!page) page = 1;
        if (page > pages) page = pages;
        const items: items[] = await prisma.items.findMany({
            take: 4,
            skip: (page - 1) * 4,
        })
        const categories = await prisma.categories.findMany();
        res.render('items/index', {
            'items': items,
            number: Number(pages),
            categories: categories,
            admin: req.session.admin
        });

    }

    async category(req: Request, res: Response) {
        const items: items[] = await prisma.items.findMany();
        const categories = await prisma.categories.findMany();
        res.render('items/category/:name', {
            'items': items,
            categories: categories,
            admin: req.session.admin
        });
    }

    async show(req: Request, res: Response) {
        const item = await prisma.items.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        const categories = await prisma.categories.findMany();

        res.render('items/show', {
            'item': item,
            categories: categories,
            admin: req.session.admin
        });
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

    async store(req: Request, res: Response) {
        const { title, categ_id, description } = req.body;
        console.log(String(req.file?.originalname));
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
                // categ_id: Number(categ_id),
            }
        });
        
        res.redirect('/items');
    }

    async destroy(req: Request, res: Response) {
        const { id } = req.body;

        await prisma.items.deleteMany({
            where: {
                id: Number(id)
            }
        });

        res.redirect('/');
    }

    async update(req: Request, res: Response) {
        const { id, title, image, description } = req.body;
        await prisma.items.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                image,
                description,
            }
        });

        res.redirect('/');
    }
}