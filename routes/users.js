const express = require('express');
const { User } = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const createError = require('../utils/error');
const { verifyAdmin, verifyToken, verifyUser } = require ('../utils/authenticationMiddleware');

// post new user
router.post("/", verifyAdmin, async (req, res, next) => {
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
});

// update user
router.put("/:id", verifyUser, async (req, res) => {
 
    try{
        const UpdatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new:true });
        res.status(200).json(UpdatedUser)
    }catch(error){
        res.status(500).json(error);
    }
});

// delete user
router.delete("/:id", verifyUser, async (req, res) => {
 
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted")
    }catch(error){
        res.status(500).json(error);
    }
});

// get user by id
router.get("/:id", verifyUser, async (req, res, next) => {

    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    }catch(error){
        res.status(500).json(error);
    }
});

// get all users
router.get("/", verifyAdmin, async (req, res, next) => {
    try{
        const userList = await User.find();
        res.status(200).json(userList)
    }catch(error){
        next(error)
    }
});

module.exports = router;
