const express = require("express");
const app = express();

const urlRoute = require('./routes/url');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url')

const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(()=>{
    console.log("MongoDB connected")
}).catch((err)=>{
    console.log(" DB not connected",err);
});

// middleware
app.use(express.json());

// testing

app.get('/test',async(req,res)=>{
    const allurls = await URL.find({});
    return res.end(`
        <html>
            <head></head>
            <body>
            <ol>
                ${allurls.map(url=>`<li>${url.shortId} - ${url.redirectUrl} - ${url.visitHistory.length}</li>`).join("")}
            </ol>
            </body>
        </html>
        `);
})

app.use('/url',urlRoute);

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