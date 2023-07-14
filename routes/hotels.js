const express = require('express');
const { Hotel } = require('../models/Hotel');
const { Room } = require('../models/Room');
const router = express.Router();
const { verifyAdmin, verifyToken, verifyUser } = require ('../utils/authenticationMiddleware');

// post new hotel
router.post("/", verifyAdmin, async (req, res) => {
    const newHotel = new Hotel(req.body);
    
    try{
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel)
    }catch(error){
        res.status(500).json(error);
    }
});

// update hotel
router.put("/:id", verifyAdmin, async (req, res) => {
 
    try{
        const UpdatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new:true });
        res.status(200).json(UpdatedHotel)
    }catch(error){
        res.status(500).json(error);
    }
});

// delete hotel
router.delete("/:id", verifyAdmin, async (req, res) => {
 
    try{
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel deleted")
    }catch(error){
        res.status(500).json(error);
    }
});

// get hotel by id
router.get("/find/:id", async (req, res) => {

    try{
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel)
    }catch(error){
        res.status(500).json(error);
    }
});

// get all hotels (also optional, req query e.g. / hotels?featured=true&limit=1) OR e.g. /hotels?featured=true&min=50&max=100
// limit in tutorial = req.query.limit but not working so manually changed
router.get("/", async (req, res, next) => {
    const {min, max, ...others} = req.query;
    try{
        const hotelList = await Hotel.find({...others, cheapestPrice: { $gt: min || 1, $lt: max || 999 }}).limit(10);
        res.status(200).json(hotelList)
    }catch(error){
        next(error)
    }
});

// returns count of hotels in each city, i.e. http://localhost:3000/hotels/countByCity?cities=Lisbon,Porto,Faro returns 1, 1, and 3 hotels in these locations
router.get("/countByCity", async (req, res, next) => {
    const cities = req.query.cities.split(",");
    
    try{
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({city: city})
        }))
        res.status(200).json(list)
    }catch(error){
        next(error)
    }
});

// gets a count of each type, returning a json object with an array holding the types and their counts
router.get("/countByType", async (req, res, next) => {
    try{
        const hotelCount = await Hotel.countDocuments({type: "hotel"});
        const apartmentCount = await Hotel.countDocuments({type: "apartment"});
        const resortCount = await Hotel.countDocuments({type: "resort"});
        const villaCount = await Hotel.countDocuments({type: "villa"});
        const cabinCount = await Hotel.countDocuments({type: "cabin"});
    
        res.status(200).json([
          {type: "hotel", count: hotelCount},
          {type: "apartment", count: apartmentCount},
          {type: "resort", count: resortCount},
          {type: "villa", count: villaCount},
          {type: "cabin", count: cabinCount}, 
        ]);
    }catch(error){
        next(error)
    }
});

// getting full list of rooms in a hotel (given hotel req.params.id) runs map function on all rooms, returning the rooms as a list
router.get("/rooms/:id", async (req, res, next) => {

    try{
        const hotel = await Hotel.findById(req.params.id)
        const list = await Promise.all(hotel.rooms.map(room=>{
            return Room.findById(room);
        }));
        res.status(200).json(list);
    }catch(error){
        next(error)
    }
});

module.exports = router; 
