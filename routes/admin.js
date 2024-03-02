const { Router } = require("express");
const router = Router()
const { Admin, Courses } = require("../database/index")
const adminMiddleware = require("../middleware/admin")
router.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Admin.findOne({
        username
    })
    .then((value) => {
        if(value){
            res.json({
                msg:"Username already exists"
            })
        }else{
            Admin.create({
                username: username,
                password: password
            })
            .then(() => {
                res.json({
                    msg: "Admin created successfully"
                })
            })
        }
    })
})

router.post("/courses", adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;

    const newCourse = Courses.create({
        title,
        description,
        imageLink,
        price
    })
    res.json({
        msg: "Course created successfully",
        courseId: newCourse._id
    })
})

router.get("/courses", adminMiddleware, (req, res) => {
    Courses.find({ })
    .then((value) => {
        res.json({
            courses: value
        })
    })
})


module.exports = router;