const { Router } = require("express");
const router = Router();
const { User, Courses } = require("../database/index");
const userMiddleware = require("../middleware/user");
const { route } = require("./admin");

router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({
        username
    })
    .then((value) => {
        if(value){
            res.status(403).json({ msg: "Username already exists"})
        }else{
            User.create({
                username: username,
                password: password
            })
            .then((response)=>{
                res.json({ msg: "User created successfully"})
            })
        }
    })
})

router.get("/", userMiddleware, (req, res) => {
    Courses.find({ published: true })
    .then((value) => {
        res.json({
            courses: value
        })
    })
})

router.post("/courses/:courseId", userMiddleware, (req, res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username;

    User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    }).catch((e)=>{
        console.log(e)
    })

    res.json({
        msg: "Purchase successful"
    })
})

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
    const user = await User.findOne({
        username: req.headers.username
    })
    const courses = await Courses.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.json({
        course: courses
    })
})

module.exports = router;