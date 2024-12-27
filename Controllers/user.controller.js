const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require('../models/user.model');
const httpStatus = require('../utils/httpStatusText');
const appError = require('../utils/AppError');
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(
     async(req, res) =>{        
         const users = await User.find({}, {"__v": false, "password":false, "token":false});
         res.status(200).json({ status: httpStatus.SUCCESS, data: { users } });
     }
    );

const register = asyncWrapper(
     async(req, res, next) =>{
        const {name, email, password, role} = req.body;
       

        const oldUser = await User.findOne({email});
        if (oldUser) {
         const error = appError.create('user already registered', 400, httpStatus.FAIL)
         return next(error);
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser  = new User({
                name,
                email,
                password : hashedPassword,
                role,
                })
            const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role}, process.env.JWT_SECRET_KEY);
            if(req.file){
                newUser.avatar = req.file.filename;
            }
            newUser.token = token;

            await newUser.save();
            res.status(201).json({ status: httpStatus.SUCCESS, data: { newUser } });
        }
    );


const login = asyncWrapper(
    async(req, res, next) =>{
        const { email, password } = req.body;
        if (!email && !password) {
            const error = appError.create('email and password are required', 400, httpStatus.FAIL);
            return next(error);
        }
        const user = await User.findOne({ email });

        if (!user){
            const error = appError.create('user not found', 401, httpStatus.FAIL);
            return next(error);
        }

        const matchedPassword = await bcrypt.compare(password, user.password);

        if (user && matchedPassword) {
            const token = await generateJWT( {email: user.email, id: user._id, role: user.role}, process.env.JWT_SECRET_KEY );
            return res.status(200).json( { status: httpStatus.SUCCESS ,data: {token} } );
        }else{
            const error = appError.create('Invalid credentials', 500, httpStatus.FAIL);
            return next(error);
        }
    })

module.exports = { getAllUsers, register, login };