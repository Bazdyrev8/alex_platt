import express, { Express, Request, Response } from 'express';
import path from 'path';
import session from 'express-session';
import { ItemsController } from './controllers/ItemsController';
import { AuthController } from './controllers/AuthController';

const app: Express = express();
const itemsController = new ItemsController();
const authController = new AuthController();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

declare module "express-session" {
  interface SessionData {
    auth: boolean,
    name: String,
    password: String
    admin: boolean,
  }
};

app.use(session({ secret: "Secret", resave: false, saveUninitialized: true }));

app.listen(1415, () => {
  console.log('Server is running on port 1415');
});

app.get("/", (req: Request, res: Response) => {
  res.render('home');
});

app.get("/items", (req: Request, res: Response) => {
  itemsController.index(req, res);
});

app.get("/items/category", (req: Request, res: Response) => {
  itemsController.category(req, res);
});


app.get("/items/:id", (req: Request, res: Response) => {
  itemsController.show(req, res);
});

app.get("/items/action/create", (req: Request, res: Response) => {
  itemsController.create(req, res);
});

app.post("/store", (req: Request, res: Response) => {
  itemsController.store(req, res);
});

app.post("/update", (req: Request, res: Response) => {
  itemsController.update(req, res);
});

app.post("/destroy", (req: Request, res: Response) => {
  itemsController.destroy(req, res);
});

app.get("/pers_acc", (req:Request,res:Response) =>{
  authController.pers_acc(req,res);
});

app.get("/logIn", (req:Request,res:Response) =>{
  authController.logIn_page(req, res);
});

app.get("/register", (req:Request,res:Response) =>{
  authController.reg_page(req, res);
});

app.post("/auth", (req:Request,res:Response) =>{
  authController.SignIn(req,res);
});

app.post("/registration", (req:Request,res:Response) =>{
  authController.SignUp(req,res);
});

app.post("/logout", (req: Request, res: Response) => {
  authController.logout(req, res);
});
