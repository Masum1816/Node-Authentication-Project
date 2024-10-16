
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const router = require('./Routes/Index');
const cookieParser = require('cookie-parser');
const PORT = 3003;
const passport = require('./configFile/passport');

mongoose.connect('mongodb+srv://masummangukiya1816:5K3e5juevrIno9Ph@masum.j7rm2.mongodb.net/').then(() => {
    console.log("MongoDb Connected");
}).catch((err) => {
    console.log("ERROR : ", err);
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, '/views')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploadsFile', express.static(path.join(__dirname, 'uploadsFile')));

app.use(require('express-session')({ secret: 'mySecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use('/', router);

app.listen(PORT, (error) => {

    if(!error){
        console.log(`Server running on http://localhost:${PORT}`);
    }

})








