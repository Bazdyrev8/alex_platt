import { Request, Response } from 'express';
import { items, users, PrismaClient } from '@prisma/client';
import { title } from 'process';
import session from 'express-session';

const prisma: PrismaClient = new PrismaClient();

let errUsername = 0;

export class CommentController {
    async createComment(req: Request, res: Response) {
        const { description, itemId } = req.body;

        if (req.session.username) {
            await prisma.comments.create({
                data: {
                    author: req.session.username,
                    description: description,
                    item_id: Number(itemId),
                }
            });
        }
        let redirect = '/items/'+ itemId;
        res.redirect(redirect);
    }

    async updateComment(req: Request, res: Response) {
        const { commentId, author, description, itemId } = req.body;
        if (req.session.username == author) {
            await prisma.comments.update({
                where: {
                    id: Number(commentId),
                },
                data:{
                    description,
                }
            });
        }
        let redirect = '/items/'+ itemId;
        res.redirect(redirect);
    }

    async destroyComment(req: Request, res: Response) {
        const { commentId, author, itemId } = req.body;
        if (req.session.admin == true || req.session.username == author) {
            await prisma.comments.delete({
                where: {
                    id: Number(commentId),
                }
            });
        }
        let redirect = '/items/'+ itemId;
        res.redirect(redirect);
    }

}