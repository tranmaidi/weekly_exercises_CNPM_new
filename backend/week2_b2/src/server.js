require('dotenv').config();
const express = require('express'); // commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api'); // tất cả route API (user + product)
const esRoutes = require('./routes/elasticsearchRoutes'); 
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8888;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config template engine
configViewEngine(app);

// Route cho view
app.get("/", getHomepage);

// Route cho API (user + product)
app.use('/v1/api', apiRoutes);
app.use('/v1/api/elasticsearch', esRoutes);

// Kết nối DB và chạy server
(async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();
