import express from "express"; //nap express
import bodyParser from "body-parser"; //nap body-parser lay tham so tu client /user?id=7
import viewEngine from './config/viewEngine.js'; //nap viewEngine
import initWebRoutes from './route/web.js'; //nap file web từ Route
import connectDB from './config/configdb.js';
require('dotenv').config(); //goi hàm config của dotenv để chạy lệnh process.env.PORT

let app = express();

//config app
app.use(bodyParser. json());
app.use(bodyParser.urlencoded({ extended: true }))
viewEngine(app);
initWebRoutes(app);
connectDB();

let port = process.env. PORT || 6969; //tao tham so port lay từ .env
//Port === undefined => port = 6969
//chay server
app.listen(port, () => {
//callback
console.log("Backend Nodejs is runing on the port : " + port)
})