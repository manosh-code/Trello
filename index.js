const express = require("express");
const {jwt} = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");

const app = express();
app.use(express.json());


app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username);

    if(userExists){
        res.status(403).json({
            message : "User already exists"
        })
        return
    }

    USERS.push({
        username,
        password,
        id: USERS_ID++
    })

    res.json({
        message: "User created successfully"
    })
})

app.post("/signin" , (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find( u => u.username === username && u.password === password);

    if(!userExists){
        res.status(401).json({
            message: "Invalid username or password"
        })
        return
    }

    const token = jwt.sign({
        userID: userExists.id
    }, "atleast32characterslongsecretkey")

    res.json({
        message: "User signed in successfully",
        token
    })
})

app.post("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    ORGANIZATIONS.push({
        id: ORGANIZATIONS.length + 1,
        tittle: req.body.tittle,
        description: req.body.description,
        admin: userId,
        members: []
        
    })

    res.json({
        message: "Organization created successfully",
        id: ORGANIZATIONS.length - 1
    })
})

app.post("/add-member", authMiddleware, (req, res) => {
    const userId = req.userId;
    const orgId = req.body.orgId;

    const organization = ORGANIZATIONS.find(org => org.id === orgId);

    if(!organization){
        res.status(404).json({
            message: "Organization not found"
        })
        return
    }

    if(organization.admin !== userId){
        res.status(403).json({
            message: "Only the admin can add members"
        })
        return
    }

    const memberId = req.body.memberId;
    const member = USERS.find(user => user.id === memberId);

    if(!member){
        res.status(404).json({
            message: "User not found"
        })
        return
    }

    organization.members.push(memberId);

    res.json({
        message: "Member added successfully"
    })
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});