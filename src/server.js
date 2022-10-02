const mongodb = require("mongoose");
const mongourl = "mongodb://127.0.0.1:27017/fake_so"
mongodb.connect(mongourl)

const snapshotDB = require('./schemas/snapshot')
const userDB = require('./schemas/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
//core
const http = require('http')
const port = 8000;
const express = require("express")
const cors = require('cors');
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//creating new user
app.post('/post/account', (req, res) =>{
    bcrypt.hash(req.body.password, saltRounds, async(error, hash)=>{
        let newAccount = new userDB({
            username: req.body.name,
            email: req.body.email,
            password: hash
        })
        try{
            await newAccount.save()
            res.send(newAccount)
        }
        catch(err){
            console.log("fail add account")
        }

    })
})
// handle logging in 
app.post('/post/account/login', (req, res)=>{
    userDB.find({email: req.body.email}, (err, data) =>{
        console.log(data)
        if (data.length != 0){
            bcrypt.compare(req.body.password, data[0].password, (err, result)=>{
                if (result ==  true){
                    res.send(data)
                }
                else{
                    res.send([])
                }
            })

        }
        else{
            res.send(data)
        }

    })
})
// uploading an new snapshot
app.post('/post/snapshot', async (req, res) =>{
    let snapshot = new snapshotDB({
        data:req.body,
    })
    await accountDB.findOneAndUpdate({email: req.body.email}, {$push:{snapshot:{$each:[snapshot], $position: 0}}})
    try{
        await newAnswer.save()
        res.send("snapshot added")
    }
    catch(err){
        console.log("fail to add snapshot")
    }


})
//use for getting all snapshot, expected input is list of snapshot id
app.post('/snapshot', async (req, res) => {
    let data = []
    for (let i of req.body){
        let snap = await snapshotDB.findById(i)
        data.push(snap)
    }
    res.send(data)
})
//get user profile
app.get('/get/user', (req, res) => {
    userDB.find((error, data)=>{
        if(error){
            console.log(error)
        }
        else{
            res.send({username: data.username, email: data.email, snapshot: data.snapshot})
        }}
    );
})
//get an snapshot with id
app.get('/get/snapshot/:id', (req, res) => {
    userDB.findOne({_id: req.params.id}, (err, data) =>{
        if (err){
            res.send(err)
        }
        else{
            res.send(data)
        }
    })
    

})
//start listening for request
const server = http.createServer(app)
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})