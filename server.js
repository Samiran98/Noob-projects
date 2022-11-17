const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/article')
const userRouter = require('./routes/user')
const Article = require('./models/article')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const app = express()

mongoose.connect('mongodb://localhost/blog')
.then(() => console.log("Database connected!"))
 .catch(err => console.log(err))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended : false }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json())

app.get('/',async (req, res) => {
    const articles = (await Article.find()).reverse()
    res.render('articles/index', { articles: articles })
})

app.get('/login',async (req, res) => {
    res.render('user/login')
})

app.get('/registration',async (req, res) => {
    res.render('user/registration')
})

app.get('/authentication', async (req,res) => {
    res.render('user/authentication')
})

app.use('/articles', articleRouter)
app.use('/auth', userRouter)

app.listen(5000)