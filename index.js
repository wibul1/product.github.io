const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { connectToDb } = require('./services/connectdb');
const port = process.env.PORT ;

// import routes
const product = require('./routes/productRoutes'); 
const user = require('./routes/userRoutes'); 
const order = require('./routes/orderRoutes'); 
const payment = require('./routes/paymentRoutes'); 


app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json()); // ใช้ body-parser เพื่อ parse ข้อมูลที่เข้ามาเป็น JSON


app.use(cors({ methods: '*' })); // ใช้ CORS เพื่ออนุญาต request จาก domain อื่น

connectToDb(); //เชื่อมต่อ db

// กำหนด part และเส้นทางของ routes
app.use('/product',product)
app.use('/user',user)
app.use('/order',order)
app.use('/payment',payment)

// กำหนด port ในการรัน Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



