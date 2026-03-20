const express = require("express");

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




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});