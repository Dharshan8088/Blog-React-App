
var express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/Post'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

const app = express();

const dotenv = require('dotenv');
dotenv.config();
const salt = bcrypt.genSaltSync(10);

const secret = 'asjsaubsy162jnsby'; // for jsonwebtoken

//middlewares
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(express.json());

app.use(cookieParser());

app.use('/uploads',express.static(__dirname + '/uploads'));

//database connect

mongoose.connect('mongodb+srv://dharshan8088:Dharshan%40125@cluster0.jw33pbs.mongodb.net/test');

app.post('/api/register', async (req,res) =>{
    const {username,password} = req.body; //preview of request data
    try{
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    }catch(e){
        res.status(400).json(e);
    }
    // res.json('test ok3');
});

app.post('/api/login', async (req,res) =>{
    const {username,password} = req.body; //preview of request data
    const userDoc = await User.findOne({username});
    // res.json(userDoc);
    const passok = bcrypt.compareSync(password, userDoc.password);
    if(passok){
        //loggedin
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) =>{
            if(err) throw err;
            // res.json(token);
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
        });
    }else{
        res.status(400).json('wrong credentials');
    }
    // res.json('test ok3');
});

app.get('/api/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if(err) throw err;
        res.json(info);
    });
    // res.json(req.cookies);
})

app.post('/api/logout', (req,res) => {
    res.cookie('token','').json('ok');
})


//POSTING POST
app.post('/api/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext
    fs.renameSync(path, newPath);
    // res.json({ext});
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if(err) throw err;
        const {title,summary,content} =req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    })
    res.json(postDoc);
    });
    
})

//UPDATING POST
app.put('/api/post',uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
  
      res.json(postDoc);
    });
  
  });
  
app.get('/api/post', async (req,res) => {
    
    res.json(await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});

app.get('/post/:id', async (req,res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

//TVCfSkoyZ1BzDnaO
//UxGn7PL0Am5JxHk2
if (process.env.API_PORT) {
    app.listen(process.env.API_PORT ,() =>{
        console.log(`Server Started Running Successfully ${process.env.API_PORT}`);
    });
}
    // app.listen(4000 ,() =>{
    //     console.log(`Server Started Running Successfully ${process.env.API_PORT}`);
    // })
module.exports = app;


