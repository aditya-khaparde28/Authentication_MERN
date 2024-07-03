const express=require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');

router.get('/test',async(req,res)=>{
    res.json({
        message:"Auth Api is working"
    })
})

function createResponse(ok,message,data){
    return{
        ok,
        message,
        data
    }
}

router.post('/register',async(req,res,next)=>{
    try{
        const{name,dateOfBirth,email,password}=req.body;
        const exsistingUser=await User.findOne({email:email});

        if(exsistingUser){
            return res.status(409).json(createResponse(false,'Email already Exsits'));
        }

        const newUser=new User({
            name,
            dateOfBirth,
            email,
            password,
        });

        await newUser.save();

        res.status(201).json(createResponse(true,'User Registred sucessfully'));


    }
    catch(err){
        next(err);
    }
})

router.post('/login',async(req,res,next)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email});


    if(!user){
        return res.status(400).json(createResponse(false,"Invalid Credentials"));
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        console.log("Passwords not match");
        return res.status(400).json(createResponse(false,"Invalid Credentials"));
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '50m' });
    res.cookie('authToken', authToken,  { httpOnly: true, secure: true, sameSite: 'None' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None' });

    res.status(200).json(createResponse(true, 'Login successful', {
        authToken,
        refreshToken
    }));
})

router.get('/checklogin',authTokenHandler,async(req,res)=>{
    res.json({
        userId:req.userId,
        ok:true,
        message:'User Authenticated Sucessfully'
    })
})


router.get('/logout' ,async(req,res,next)=>{
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok:true,
        message:'User logged out sucessfully'
    })
})

module.exports = router;
