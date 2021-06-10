const dotenv = require("dotenv");
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
app.use(cookieParser());

dotenv.config({ path: './config.env' });

require('./db/conn');
// const User = require('./model/userSchema');

app.use(cors())
app.use(express.json());
// we link the router files to make our route easy 
app.use(require('./routes/auth'));

const PORT = process.env.PORT;

//// I just comment out the below about section 
// app.get('/about', (req, res) => {
//     console.log(`Hello my About`);
//     res.send(`Hello About world from the server`);
// });

// app.get('/contact', (req, res) => {
//     // res.cookie("Test", 'thapa');
//     res.send(`Hello Contact world from the server`);

// });

// app.get('/signin', (req, res) => {
//     res.send(`Hello Login world from the server`);
// });

app.get('/signup', (req, res) => {
    res.send(`Hello Registration world from the server`);
});

app.listen(PORT, () => {
    console.log(`server is runnig at port no ${PORT}`);
})

