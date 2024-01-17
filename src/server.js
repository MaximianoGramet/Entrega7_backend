import express from "express";
import ProductRouter from "./routes/products.routes.js";
import CartRouter from "./routes/carts.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import messageDao from "./daos/dbManager/message.dao.js";
import UserViewsRouter from "./routes/users.views.router.js"
import SessionRouter from "./routes/session.router.js"
import MongoStore from 'connect-mongo';



const Host = express();
const PORT= 8080;

const httpServer = Host.listen(PORT,()=>{
    console.log(`Initiating server at port: ${PORT}...`);
})

mongoose.connect('mongodb+srv://Admin:1q2w3e@cluster0.n5ooq40.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('Connection established');
})
.catch(error => {
    console.error('Connection failed', error);
});
const io = new Server(httpServer);

Host.use(express.json());
Host.use(express.urlencoded({extended: true}));

Host.engine("hbs", handlebars.engine({
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      eq: function (a, b) {
        return a === b;
      }
    }
}));

Host.set("view engine", "hbs");
Host.set("views", `${__dirname}/routes/views`);

Host.use(express.static(`${__dirname}/public`))

Host.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    mongoUrl: "'mongodb+srv://Admin:1q2w3e@cluster0.n5ooq40.mongodb.net/?retryWrites=true&w=majority",
    ttl: 10 * 60, 
  }),
  secret: "Th1s1sA5ecret",
  resave: false,
  saveUninitialized: true,
}));

io.on('connection', (socket) => {
    console.log('new client connected');
  
    socket.on('chat message', async (msg) => {
      try {
        await messageDao.createMessage({ user: msg.user, message: msg.content });
      } catch (error) {
        console.log(error);
      }
      io.emit('chat message', msg);
    });
  });

Host.use(express.json())
Host.use(express.urlencoded({extended:true}));

Host.use("/api/products", ProductRouter);
Host.use("/api/carts", CartRouter);
Host.use("/", ViewsRouter);
app.use("/api/sessions",SessionRouter);
app.use("/users",UserViewsRouter);