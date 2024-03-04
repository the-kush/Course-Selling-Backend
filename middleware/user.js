const jsw = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// const { User } = require("../database/index");

// function userMiddleware(req, res, next){
//     const username = req.headers.username;
//     const password = req.headers.password;

//     User.findOne({
//         username
//     })
//     .then((value) => {
//         if(value){
//             next();
//         }else{
//             res.status(403).json({
//                 msg: "User already exists"
//             })
//         }
//     })
// }

function userMiddleware(req, res, next){
    const token = req.headers.authorization;
    const word = token.split(" ");
    const jwtToken = word[1];

    try{
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        if(decodedValue.username){
            req.username = decodedValue.username
            next();
        }else{
            res.status(411).json({
                msg: "invalid authentication"
            })
        }
    }catch(e){
        res.json({
            msg: "Invalid credentials"
        })
    }
}

module.exports = userMiddleware;