const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const { restrictToLoggedInUserOnly } = require('./middlewares/auth');

const app = express();

const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');

const staticRoute = require('./routes/staticRouter');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');

const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(()=>{
    console.log("MongoDB connected")
}).catch((err)=>{
    console.log(" DB not connected",err);
});


app.set("view engine","ejs");
app.set('views',path.resolve("./views"));
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));





app.use('/url',restrictToLoggedInUserOnly,urlRoute);
app.use('/user',userRoute);
app.use('/',staticRoute);

app.get('/:shortid',async(req,res)=>{
    const shortid = req.params.shortid;
    const entry = await URL.findOneAndUpdate({
         shortId: shortid ,
    },{ $push:{
        visitHistory :{
            timestamp:Date.now(),
        }
    }});
    res.redirect(entry.redirectUrl);
});
app.listen(PORT,()=>{
    console.log("server started");
})