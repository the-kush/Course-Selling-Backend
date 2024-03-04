const { Router } = require("express");
const router = Router();
const { User, Courses } = require("../database/index");
const userMiddleware = require("../middleware/user");
const { route } = require("./admin");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.post("/signup", (req, res) => {
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

router.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await findOne({
        username,
        password
    })

    if(findUser){
        const jwtToken = jwt.sign({username}, JWT_SECRET);
        res.json({
            jwtToken
        })
    }else{
        res.status(411).json({
            msg: "invalid credentials"
        })
    }
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
    const username = req.username;
    const courseId = req.params.courseId;

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
    const username = req.username;
    const user = await User.findOne({
        username
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