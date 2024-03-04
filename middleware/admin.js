const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// const { Admin } = require("../database/index");

// function adminMiddleware(req, res, next){
//     const username = req.headers.username;
//     const password = req.headers.password;

//     Admin.findOne({
//         username,
//         password
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

function adminMiddleware(req, res, next){
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];

    try{
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        if(decodedValue.username){
            next();
        }else{
            res.status(403).json({
                msg: "Invalid credentials"
            })
        }
    }catch(e){
        res.json({
            msg: "Invalid authentication"
        })
    }
}

module.exports = adminMiddleware;