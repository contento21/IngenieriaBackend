import express from "express";
// const express = require("express");
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); () => {
    console.log("connected to DB")
}


//user schema 
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
}, { collection: 'users' })

const User = new mongoose.model("User", userSchema)

//routes routes
app.post("/Login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ status: true, code: 1, user: user })
            } else {
                res.send({ status: true, code: 2 })
            }
        } else {
            res.send({ status: true, code: 3 })
        }
    })
});


app.post("/Register", (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "user already exist" })
        } else {
            const user = new User({ name, email, password })
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "sucessfull" })
                }
            })
        }
    })
})


app.get("/Users", async (req, res) => {
    const listUsers = [];
    for await (const doc of User.find()) {
        console.log(doc);
        listUsers.push(doc)
    }

    res.send(listUsers)
})


app.delete("/Delete", async (req, res) => {

    const { email } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            user.remove();
            res.send({ message: "Usuario eliminado" })
        } else {
            res.send({ message: "Usuario no existe" })
        }
    })
})


app.put("/Update", async (req, res) => {
    const { id, name, email } = req.body;
    const doc = await User.update({
        _id: id
    }, { email, name}, { upsert: true }, function(err, doc) {
        if (err) return res.send({message: "No se pudo eliminar"});
        return res.send({message: "usuario actualizado"})
    });
})


app.listen(6969, () => {
    console.log("started")
})