const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const routes = require('./src/routes/layout.routes.js');
const {connectDB} = require('./src/config/index.js');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true  
    }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', routes);

connectDB();
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
