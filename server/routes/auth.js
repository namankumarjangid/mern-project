const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');
const { OAuth2Client, LoginTicket } = require('google-auth-library')
const authenticate = require("../middleware/authenticate");

const client = new OAuth2Client(process.env.googleClientID)

require('../db/conn');
const User = require("../model/userSchema");
const { response } = require('express');

router.get('/', (req, res) => {
    res.send(`Hello world from the server rotuer js`);
});



// using promises  

// router.post('/register', (req, res) => {

//     const { name, email, phone, work, password, cpassword} = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Plz filled the field properly" });
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "Email already Exist" });
//             }

//             const user = new User({ name, email, phone, work, password, cpassword });

//             user.save().then(() => {
//                 res.status(201).json({ message: "user registered successfuly" });
//             }).catch((err) => res.status(500).json({ error: "Failed to registered" }));

//         }).catch(err => { console.log(err); });

// });

// Async-Await 

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Plz filled the field properly" });
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password are not matching" });
        } else {
            const user = new User({ name, email, phone, work, password, cpassword });
            // yeha pe 
            await user.save();
            res.status(201).json({ message: "user registered successfuly" });
        }


    } catch (err) {
        console.log(err);
    }

});

// login route 

router.post('/signin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Plz Filled the data" })
        }

        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);



            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials " });
            } else {
                // need to genereate the token and stored cookie after the password match 
                token = await userLogin.generateAuthToken();
                console.log(token);

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });

                res.json({ message: "user Signin Successfully" });
            }
        } else {
            res.status(400).json({ error: "Invalid Credientials " });
        }

    } catch (err) {
        console.log(err);
    }
});


// about us ka page 

router.get('/about', authenticate, (req, res) => {
    // console.log(`my About`);
    res.send(req.rootUser);
});

// get user data for contact us and home page 
router.get('/getdata', authenticate, (req, res) => {
    // console.log(`get data`);
    res.send(req.rootUser);
});

// contact us page 

router.post('/contact', authenticate, async (req, res) => {
    try {

        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({ error: "plzz filled the contact form " });
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {

            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({ message: "user Contact successfully" });

        }

    } catch (error) {
        console.log(error);
    }

});


// Logout  ka page 
router.get('/logout', (req, res) => {
    // console.log(`my Logout Page`);
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send('User lOgout');
});


// google login route
router.post("/googlelogin", async (req, res) => {

    try {
        let { token } = req.body
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.googleClientID
        });

        const { name, email, picture } = ticket.getPayload();

        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);

        if (userLogin) {

            // need to genereate the token and stored cookie after the password match 
            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            res.json({ message: "user Signin Successfully" });
        }
        else {
            res.status(400).json({ error: "Invalid Credientials " });
        }
    }
    catch (error) {
        console.log(error)
    }



})






// router.post("/googlelogin", (req, res) => {
//     const { token } = req.body;
//     client.verifyIdToken({ idToken: token, audience: process.env.googleClientID }).then(response => {
//         const { email_verified, name, email } = response.payload;
//         if (email_verified) {
//             User.findOne({ email }).exec((err, user) => {
//                 if (err) {
//                     return res.status(400).json({
//                         error: "Something went wrong..."
//                     })
//                 } else {
//                     if (user) {
//                         const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
//                         const { _id, name, email } = user;

//                         res.json({
//                             token,
//                             user: { _id, name, email }
//                         })
//                     } else {
//                         // let password = email + process.env.SECRET_KEY;

//                         let newUser = new User({ name, email });
//                         newUser.save((err, data) => {
//                             if (err) {
//                                 return res.status(400).json({
//                                     error: "Something went wrong..."
//                                 })
//                             }
//                             const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
//                             const { _id, name, email } = newUser;

//                             res.json({
//                                 token,
//                                 user: { _id, name, email }
//                             })
//                         })
//                     }

//                 }
//             })
//         }
//     })
// })


module.exports = router;

