const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/article')
const Article = require('./models/article')
const methodOverride = require('method-override')

const app = express()

mongoose.connect('mongodb://localhost/blog')
.then(() => console.log("Database connected!"))
 .catch(err => console.log(err))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended : false }))
app.use(methodOverride('_method'))

app.get('/',async (req, res) => {
    const articles = (await Article.find()).reverse()
    res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)

app.listen(5000)