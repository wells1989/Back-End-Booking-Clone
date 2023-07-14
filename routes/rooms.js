const express = require('express');
const { Hotel } = require('../models/Hotel');
const { Room } = require('../models/Room');
const router = express.Router();
const { verifyAdmin, verifyToken, verifyUser } = require ('../utils/authenticationMiddleware');

// create new room
router.post("/:hotelid", verifyAdmin, async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room (req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push : {rooms: savedRoom._id},
            })

        } catch (err) {
           next(err) 
        }
        res.status(200).json(savedRoom);
    } catch (err) { 
        next(err)
    }
});
// above, gets hotelid from params, then saves room and updates the hotel, pushing the new saved room to the hotels listed rooms array 

// update room
router.put("/:id", verifyAdmin, async (req, res) => {
 
    try{
        const UpdatedRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new:true });
        res.status(200).json(UpdatedRoom)
    }catch(error){
        res.status(500).json(error);
    }
});

// delete room
router.delete("/:id/:hotelid", verifyAdmin, async (req, res) => {
 const hotelid = req.params.hotelid;
    try{
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(req.params.hotelid, {
                $pull: { rooms: req.params.id }
            });
        } catch (err) {
            next(err)
        }
        res.status(200).json("Room deleted")
    }catch(error){
        res.status(500).json(error);
    }
});
// takes room parameter to delete, then updates the hotel by hotel id, pulling / removing the room id from its list

// get room by id
router.get("/:id", async (req, res) => {

    try{
        const room = await Room.findById(req.params.id);
        res.status(200).json(room)
    }catch(error){
        res.status(500).json(error);
    }
});

// get all rooms
router.get("/", async (req, res, next) => {
    try{
        const roomList = await Room.find();
        res.status(200).json(roomList)
    }catch(error){
        next(error)
    }
});

// update room availability
router.put("/availability/:id", verifyAdmin, async (req, res) => {
 
    try{
        await Room.updateOne({ "roomNumbers._id": req.params.id },
        {
            $push: {
                "roomNumbers.$.unavailableDates": req.body.dates
            },
        })
        res.status(200).json("Room status updated");
    }catch(error){
        res.status(500).json(error);
    }
});
// above, gets the room id by req.params.id (room id is within room > roomNumbers, then each room number has its own unavailable dates.) then pushes the req.body.dates to that array within roomNumbers

module.exports = router;