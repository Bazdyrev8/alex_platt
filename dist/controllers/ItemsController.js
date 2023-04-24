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
exports.ItemsController = void 0;
const client_1 = require("@prisma/client");
// import * as fs from 'fs';
const prisma = new client_1.PrismaClient();
class ItemsController {
    home(req, res) {
        res.render('home', {
            admin: req.session.admin
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = Number(req.query.page); // localhost?page=4
            const count = yield prisma.items.count({});
            let pages = Math.ceil(count / 4);
            if (!page)
                page = 1;
            if (page > pages)
                page = pages;
            const items = yield prisma.items.findMany({
                take: 4,
                skip: (page - 1) * 4,
            });
            console.log(items);
            console.log(pages);
            const categories = yield prisma.categories.findMany();
            res.render('items/index', {
                'items': items,
                number: Number(pages),
                categories: categories,
                admin: req.session.admin
            });
        });
    }
    // async copyFileFolder(req: Request, res: Response) {
    //     console.log("copppppy");
    //     const { file } = req.body;
    //     const targetFolder = './public/img/';
    //     if (file) {
    //       const sourcePath = file.path;
    //       const targetPath = targetFolder + file.originalname;
    //       fs.copyFile(sourcePath, targetPath, (err: any) => {
    //           if (err) throw err;
    //           console.log('File copied to ' + targetPath);
    //        //   Дополнительная обработка загруженного файла
    //           // ...
    //           res.send('File uploaded successfully');
    //         });
    //     } else {
    //       res.status(400).send('No file uploaded');
    //     }
    // }
    category(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield prisma.items.findMany();
            const categories = yield prisma.categories.findMany();
            res.render('items/category/:name', {
                'items': items,
                categories: categories,
                admin: req.session.admin
            });
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield prisma.items.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
            const categories = yield prisma.categories.findMany();
            res.render('items/show', {
                'item': item,
                categories: categories,
                admin: req.session.admin
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.admin) {
                const categories = yield prisma.categories.findMany();
                res.render('items/create', {
                    categories: categories,
                    admin: req.session.admin
                });
            }
            else {
                res.render('home', {
                    admin: req.session.admin
                });
            }
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const selectElement: any = document.querySelector(".ice-cream");
            // selectElement.addEventListener("change", (event: Event) => {
            //   const result: any = document.querySelector(".result");
            //   result.textContent = `You like ${(event.target as HTMLInputElement).value}`;
            // }); 
            const { title, image, categ_id, description } = req.body;
            yield prisma.items.create({
                data: {
                    title,
                    image,
                    category: {
                        connect: {
                            id: Number(categ_id)
                        }
                    },
                    description,
                    // categ_id: Number(categ_id),
                }
            });
            res.redirect('/');
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            yield prisma.items.deleteMany({
                where: {
                    id: Number(id)
                }
            });
            res.redirect('/');
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, title, image, description } = req.body;
            yield prisma.items.update({
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
        });
    }
}
exports.ItemsController = ItemsController;
