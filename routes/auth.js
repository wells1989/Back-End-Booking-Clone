const express = require('express')
const { User } = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createError } = require('../utils/error');
const jwt = require('jsonwebtoken');
const { verifyAdmin, verifyToken, verifyUser } = require ('../utils/authenticationMiddleware');

router.post("/register", async (req,res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })

        await newUser.save()
        res.status(201).send("User created")
    } catch(err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
       const user = await User.findOne({username: req.body.username}) 
    if (!user) res.status(404).send("User not found")

    const correctPassword = await bcrypt.compare(req.body.password, user.password);

    if (!correctPassword) {
        res.status(400).send("incorrect password!")
    } else {
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.SECRET);
        
        res.cookie("access_token", token, {
            httpOnly: true
        })

        .status(200).send({
            username: user.username,
            email: user.email,
            token: token,
            id: user._id,
            isAdmin: user.isAdmin
        })
    }
    } catch(err) {
        next(err)
    }
})

router.post("/logout", (req, res) => {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  });

module.exports = router;
