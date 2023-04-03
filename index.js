const express = require('express');
const app = express();
require('dotenv').config();
const PORT = 3000;
const userMap = new Map();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const e = require('express');
const SECRET = process.env.SECRET;
app.use(express.json());

function generateToken(user) {
    return jwt.sign(user, SECRET, { expiresIn: '1h' });
  }


app.post('/signup', (req, res) => {
    try {
        if (!userMap.has(req.body.email)) {
            userMap.set(req.body.email, {
                username : req.body.username,
                email : req.body.email,
                password : req.body.password
            });
            return res.status(200).send(userMap.get(req.body.email));
        }
    } catch (error) {
        return res.status(418).send("Something went wrong");
    }
});



app.post('/signin', (req, res) => {
    const user = userMap.get(req.body.email);
    if (!user) {
        return res.sendStatus(404);
    }
     if (req.body.password === user.password) {
        const accessKey = generateToken(user);
        return res.status(200).send({
            ...user,
            accessKey : accessKey
        });
    }
    return res.status(401).send("Wrong Password");
});

app.use((req, res, next) => {
    const token = req.header('access_key');
    console.log(token)
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(401)
        }
        req.user = user;
       return next();
      }); 
 })


app.put('/user', (req, res) => {
    try {
        console.log(req.user.email);
    if (userMap.has(req.user.email)) {
        userMap.set(req.user.email, {
            username : req.body.username,
            email : req.user.email,
            password : req.body.password
        });
        return res.status(200).send(userMap.get(req.user.email));
    };
        return res.sendStatus(404);
    } catch(e) {
        res.status(400).send(e);
    } 
})

app.listen(3000, ()=> {
    console.log(`http://localhost:3000`);
});
