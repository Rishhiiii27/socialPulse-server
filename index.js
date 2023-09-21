const express = require('express');
const  dotenv= require('dotenv');
const dbConnect = require('./dbConnect')
const authRouter = require('./routers/authRouter')
const postsRouter = require('./routers/postsRouter')
const userRouter = require('./routers/userRouter')
const morgan = require ('morgan');
const cookieParser = require('cookie-parser');
const cors =require('cors')
const cloudinary = require('cloudinary').v2;


dotenv.config('./.env');    

// import {v2 as cloudinary} from 'cloudinary';


          
cloudinary.config({ 
    secure:true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const app = express();
//---------\\\
//---------->>>MIDDLEWARES
//---------///
app.use(express.json({limit:"10mb"}));
app.use(morgan('common'));
app.use(cookieParser());

// let origin = 'http://localhost:3000';
// console.log('here env', process.env.NODE_ENV);
// if(process.env.NODE_ENV === 'production') {
//     origin = process.env.CLIENT_ORIGIN;
// }

app.use(cors({
    credentials:true,
    origin:'http://localhost:3000'
}))



app.use('/auth',authRouter)
app.use('/posts',postsRouter)
app.use('/user',userRouter)

app.get('/',(req,res)=>{
    res.status(200).send('ok from server');
})

const port=process.env.PORT || 4000;

// dbConnect(); 

app.listen(port,()=>
{
    console.log(`listening on port: ${port}` )
})