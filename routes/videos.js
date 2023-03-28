const express = require("express");
const { auth } = require("../middlewares/auth");
const { VideoModel, validateVideo } = require("../models/videoModel");
const router = express.Router();


router.get("/", async (req, res) => {
    //http://localhost:3001/videos?page=3&perPage=5
    //http://localhost:3001/videos?perPage=10
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 5;
    //http://localhost:3001/videos?page=1
    let page = req.query.page - 1 || 0;
    //http://localhost:3001/videos?perPage=5&sort=price
    let sort = req.query.sort || "price";
    //http://localhost:3001/videos?sort=price&reverse=yes
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    try {
        let data = await VideoModel
            .find({}) // filter by price range
            .limit(perPage) // limits of videos per page
            .skip(page * perPage) // skips of videos per page
            .sort({ [sort]: reverse }); // sorts by price
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});


router.get("/single/:id", async (req, res) => {
    try {
        const id = req.params.id
        let data = await VideoModel.findOne({ _id: id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.post("/", auth, async (req, res) => {
    let validBody = validateVideo(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let video = new VideoModel(req.body);
        video.user_id = req.tokenData._id
        await video.save();
        res.json(video)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", auth, async (req, res) => {
    let validBody = validateVideo(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.id;
        let data = await VideoModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await VideoModel.deleteOne({ _id: id, user_id: req.tokenData._id });
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;