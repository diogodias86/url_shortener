const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

mongoose.connect(
    'mongodb_url', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((err) => {
    console.log(err)
})

app.get('/', async (req, res) => {
    let urls = await ShortUrl.find()
    res.render('index', { urls })
})

app.get('/:shortUrl', async (req, res) => {
    let url = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (url == null) return res.sendStatus(400)

    url.clicks++
    url.save()

    res.redirect(url.full)
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.listen(3000)
