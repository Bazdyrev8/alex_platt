"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const multer_1 = __importDefault(require("multer"));
const ItemsController_1 = require("./controllers/ItemsController");
const AuthController_1 = require("./controllers/AuthController");
const CommentController_1 = require("./controllers/CommentController");
const app = (0, express_1.default)();
const itemsController = new ItemsController_1.ItemsController();
const authController = new AuthController_1.AuthController();
const commentController = new CommentController_1.CommentController();
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use((0, express_session_1.default)({ secret: "Secret", resave: false, saveUninitialized: true }));
;
// MULTER
let storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
let upload = (0, multer_1.default)({ storage: storage });
//
app.listen(1415, () => {
    console.log('Server is running on port 1415');
});
app.get("", (req, res) => {
    itemsController.home(req, res);
});
app.get("/items", (req, res) => {
    itemsController.index(req, res);
});
app.get("/items/category/:id", (req, res) => {
    itemsController.category(req, res);
});
app.get("/items/:id", (req, res) => {
    itemsController.show(req, res);
});
app.get("/items/action/create", (req, res) => {
    itemsController.create(req, res);
});
app.get("/categories/create", (req, res) => {
    itemsController.createCategPage(req, res);
});
app.post("/categories/action/create", (req, res) => {
    itemsController.createCateg(req, res);
});
app.post("/store", upload.single('file'), (req, res, next) => {
    itemsController.store(req, res);
});
app.post("/update", upload.single('file'), (req, res) => {
    itemsController.update(req, res);
});
app.post("/destroy", (req, res) => {
    itemsController.destroy(req, res);
});
app.get("/pers_acc", (req, res) => {
    authController.pers_acc(req, res);
});
app.get("/logIn", (req, res) => {
    authController.logIn_page(req, res);
});
app.get("/register", (req, res) => {
    authController.reg_page(req, res);
});
app.post("/auth", (req, res) => {
    authController.SignIn(req, res);
});
app.post("/registration", (req, res) => {
    authController.SignUp(req, res);
});
// app.post("/update_password", (req: Request, res: Response) => {
//   authController.updatePassword(req, res);
// });
app.get("/update_password", (req, res) => {
    authController.updatePassword(req, res);
});
// app.post("/destroy_account", (req: Request, res: Response) => {
//   authController.destroyAccount(req, res);
// });
app.get("/destroy_account", (req, res) => {
    authController.destroyAccount(req, res);
});
app.get("/create_admin", (req, res) => {
    authController.createAdmin(req, res);
});
// app.post("/create_admin", (req: Request, res: Response) => {
//   authController.createAdminAccount(req, res);
// });
app.post("/toFavorites", (req, res) => {
    authController.toFavorites(req, res);
});
app.post("/deleteFavorit", (req, res) => {
    authController.deleteFavorit(req, res);
});
app.get("/favorites", (req, res) => {
    authController.viewFavorites(req, res);
});
app.post("/logout", (req, res) => {
    authController.logout(req, res);
});
app.post("/createComment", (req, res) => {
    commentController.createComment(req, res);
});
app.post("/deleteComment", (req, res) => {
    commentController.destroyComment(req, res);
});
