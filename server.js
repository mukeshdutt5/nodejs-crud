const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoClient = require('mongodb').MongoClient


mongoServerUrl = 'mongodb://localhost:27017/crud'
port = 3100
siteURL = 'http://localhost:' + port
var db

// Using express body parse
app.use(bodyParser.urlencoded({ extended: true }))

// Setting view engine
app.set('views', __dirname + '/views/')
app.set('view engine', 'pug')

// Index source
app.get('/', (req, res) => {
    res.send("Hey welcome to node js application")
})

// Index page routing is here
app.get('/', (req, res) => {

    var collection = db.collection("user")
    collection.find({}).sort({ _id: -1 }).toArray(function(err, docs) {
        res.render('index', { url: siteURL, title: 'Nodejs Crud Application', message: 'Welcome to NodeJs CRUD Application', users: docs })
    })
})

// Edit get : Information to get which is needs to update
app.get('/edit', (req, res) => {

    var collection = db.collection('user')
    collection.find({ mobile: req.query.mobile }).toArray(function(err, r) {
        res.render("edit", { title: 'Updating record of' + req.query.mobile, user: r[0] })
    })
})

// Edit edit : Infomation to update
app.post('/edit', (req, res) => {

    var collection = db.collection('user')

    var gender
    if (req.body.gender)
        gender = 'M'

    collection.update({ mobile: req.body.mobile }, {
        $set: {
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            gender: gender,
            address: req.body.address
        },
    }, { w: 0 }, function(err, result) {

        if (err) return err
        console.log('Wow! Records updated successfully.')
    })
    res.redirect('/index')
})

// Add get : Information which is needs to capture
app.get('/add', (req, res) => {
    res.render('add', { title: 'Add user information' })
})

// Add post : Capture data from html form and send to database
app.post('/add', (req, res) => {

    var collection = db.collection('user')
    collection.insert(req.body, (err, result) => {

        if (err) return er
        console.log('Successfully saved records')
    });

    // Redirecting to index page
    res.redirect('/index')
})

// When no resource will be available
app.use('*', function(req, res) {
    res.render('404')
})

// We are establishing mongodb connection here
mongoClient.connect(mongoServerUrl, function(err, database) {

    // database to db for further operation
    db = database

    if (err) return err
    console.log('Database connection successfully established')

    // Starting the server here
    app.listen(process.env.PORT || port, () => {
        console.log("Server running")
    })
})
