require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;
const url = process.env.MONGO_URL;
const courseRouter = require('./routes/course.routes');
const userRouter = require('./routes/user.routes');
const forgotPasswordRouter = require('./routes/forgot-password.routes');
const httpStatus = require('./utils/httpStatusText');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/courses',courseRouter);
app.use('/api/users', userRouter);
app.use('/password', forgotPasswordRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads') ) );



mongoose.connect(url).then(() =>{
    console.log('Connected to MongoDB');
})

// global middleware for not found routes
app.all('*', (req, res) => {
   res.status(404).json({status: httpStatus.ERROR, message: "this resource is not available"});
})

// global error handler  **** 3 ****
app.use((error, req, res, next)=>{
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatus.ERROR, message: error.message, data: null});
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})


