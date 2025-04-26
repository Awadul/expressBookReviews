const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors())
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log("customer auth ")
    //Write the authenication mechanism here
    console.log(req.session)
    if (req.session.accessToken) {
        console.log("2 - session found")
        const token = req.session["accessToken"];

        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (err) {
                return res.status(401).send({ msg: "Invalid user." })
            } else {
                console.log(user)
                req.userInfo = user
                next();
            }
        })
    } else {
        return res.status(401).send({ msg: "Invalid user." })
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running " + PORT));
