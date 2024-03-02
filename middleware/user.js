const { User } = require("../database/index");

function userMiddleware(req, res, next){
    const username = req.headers.username;
    const password = req.headers.password;

    User.findOne({
        username
    })
    .then((value) => {
        if(value){
            next();
        }else{
            res.status(403).json({
                msg: "User already exists"
            })
        }
    })
}

module.exports = userMiddleware;