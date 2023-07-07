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
exports.CommentController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let errUsername = 0;
class CommentController {
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, itemId } = req.body;
            if (req.session.username) {
                yield prisma.comments.create({
                    data: {
                        author: req.session.username,
                        description: description,
                        item_id: Number(itemId),
                    }
                });
            }
            let redirect = '/items/' + itemId;
            res.redirect(redirect);
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { commentId, author, description, itemId } = req.body;
            if (req.session.username == author) {
                yield prisma.comments.update({
                    where: {
                        id: Number(commentId),
                    },
                    data: {
                        description,
                    }
                });
            }
            let redirect = '/items/' + itemId;
            res.redirect(redirect);
        });
    }
    destroyComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { commentId, author, itemId } = req.body;
            if (req.session.admin == true || req.session.username == author) {
                yield prisma.comments.delete({
                    where: {
                        id: Number(commentId),
                    }
                });
            }
            let redirect = '/items/' + itemId;
            res.redirect(redirect);
        });
    }
}
exports.CommentController = CommentController;
