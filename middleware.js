const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next){
    const token = req.headers.token;

    const decoded = jwt.verify(token, "attlasiationsupersecret123123password");

    const userId = decoded.userId;

    if(userId){
        req.userId = userId;
        next();
    }else{
        res.status(401).json({
            message: "Unauthorized"
        });
    }
}

module.exports = {
    authMiddleware: authMiddleware
}