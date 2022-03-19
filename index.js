const express = require('express');
const path = require('path');
const db = require('./db/db.js');
const env = require('dotenv').config({})
process.env = {...process.env,...require('dotenv-parse-variables')(env.parsed)};
const bodyParser = require('body-parser');
const { registraion, auth } = require('./auth-service.js');
const cookieParser = require('cookie-parser')
const json2html = require('json2html')


const app = express()

app.set("view engine","ejs")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

const PORT = process.env.PORT ?? 8800

function getCookie(name, cookie) {
    const value = `; ${cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

let access_token = ''

app.get('/', (req,res) => {
    if (getCookie("access_token", req.headers.cookie) === access_token)
    {
        res.send('<h1>Hello user!</h1>')
    }
    res.send('<h1>Hello Express</h1>')
})

app.get('/v1/cars', (req,res) => {
    if (getCookie("access_token", req.headers.cookie) === access_token)
    {
        res.end(json2html.render([{
            id:1,
            model:"m3",
            price:10000000,
            power:500,
            description:null,
            brandName:"BMW"
        },
            {
                id:2,
                model:"m2 competition",
                price:100000000,
                power:1000,
                description:null,
                brandName:"BMW"
            }

        ]));
    }
    res.end(json2html.render([{access:"error"}]));
})

app.get('/log', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'log.html'))
})

app.get('/reg', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'reg.html'))
})

app.post("/registration", async (req,res,next)=>{
    try{
        const {login, password, confirm} = req.body;
        const data = await registraion(login,password,confirm)
        res.json(data)
    }catch(e){
        next(e)
    }
})

app.post("/auth", async (req,res,next)=>{
    try{
        const {login, password} = req.body;
        const  data = await auth(login,password)
        access_token = data
        res.cookie('access_token', data)
        res.json({ok: "ok"})
    }catch(e){
        next(e)
    }
})

app.get('/genryblackeye', (req,res) => {
    res.send('<h1>Server created by Genry Blackeye!</h1>')
})

app.get('/cretedb', (req,res) => {
    return users.sync({ force: true });
})

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))