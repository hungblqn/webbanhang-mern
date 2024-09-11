import express from 'express';
import { PORT,mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Account } from './models/accountModel.js';
import accountRoute from './routes/accountRoute.js';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();

// Sử dụng middleware để xử lý JSON và giới hạn dung lượng của request lên đến 1MB
app.use(bodyParser.json({limit: '1mb'}));

// Sử dụng CORS middleware để cho phép các yêu cầu từ origin http://localhost:5173
app.use(cors({
    origin: 'http://localhost:5173',  // Update this with your frontend origin
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true,
}));

// Sử dụng middleware để xử lý cookie
app.use(cookieParser());

app.get('/', (request,response) => {
    console.log(request);
    return response.status(234).send(`Chào mừng đến với web của hungblqn`);
});

// Sử dụng các router đã được định nghĩa
app.use('/accounts', accountRoute);
app.use('/products', productRoute);
app.use('/carts', cartRoute);
app.use('/orders', orderRoute);
app.use('/categories', categoryRoute);



// Kết nối đến MongoDB và khởi động máy chủ backend
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Đã kết nối với MongoDB');
        app.listen(PORT, () =>{
            console.log(`Server backend đang chạy ở cổng ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

