const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const { error, success } = require('../utils/responseWrapper');


const signupController = async(req,res)=>
{
    try{
        const{name,email,password} = req.body;

        if(!email || !password ||!name)
        {
            return res.send(error(400,'All fields are required'))
        }

        const oldUser = await User.findOne({email});
        if(oldUser)
        {
            return res.send(error(409,'user is already registered'))
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        return res.send(
            success(201,'user created successfully') );

        // res.status(200).json({ success: true, message: 'Signup successful' });
  
    }catch(e){
        res.send(error(500,e.message))
    }
}

const loginController = async(req,res)=>
{
    try{
        const{email,password} = req.body;

        if(!email || !password)
        {
            return res.send(error(400,'All fields are required'));
        }

        const user = await User.findOne({email}).select('+password');
        if(!user)
        {
            // res.status(404).send("user is not registered");
            return res.send(error(404,'user is not registered'));
        }

        const matched = await bcrypt.compare(password,user.password)
         if(!matched)
         {
            // res.status(403).send("incorrect password");
            return res.send(error(403,'incorrect password'));
         }

         const accessToken = generateAccessToken({id:user._id});
    
         const refreshToken = generateRefreshToken({id:user._id});

         res.cookie('jwt',refreshToken,{
            httpOnly:true,
            secure:true,
         });

         return res.send(success(200,{accessToken}));

    }catch(e){
        res.send(error(500,e.message))
    }
    
}


const refreshAccessTokenController = async(req,res)=>
{
    
    const cookies = req.cookies;
    if(!cookies.jwt)
    {
        // return res.status(401).send("refresh token is required");
        return res.send(error(401,'refresh token is required'));
    }
    const refreshToken =cookies.jwt;

    try{
          
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);

        const  _id =decoded._id;
        const accessToken = generateAccessToken({_id});

        return res.send(success(201,{accessToken}));
    }
    catch(e)
    {
        console.log(e);
        // return res.status(401).send('invalid refresh token')
        return res.send(error(401,'invalid refresh token'));
    }
}

const logoutController = async(req,res)=>
{   
    try {
        
        res.clearCookie('jwt',{
            httpOnly:true,
            secure:true
        })

        return res.send(success(200,"user logged out"))

    } catch (e) {
        return res.send(error(500,e.message))
    }
}

//internal functions
const generateAccessToken =(data)=>
{
    try{
    const token = jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
        expiresIn:'1d',
    });
    console.log(token)
    return token;
    }
    catch(error){
        console.log(error);
    }
}

const generateRefreshToken =(data)=>
{
    try{
    const token = jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{
        expiresIn:'1y',
    });
    console.log(token)
    return token;
    }
    catch(error){
        console.log(error);
    }
}
module.exports={signupController,loginController,refreshAccessTokenController,logoutController};