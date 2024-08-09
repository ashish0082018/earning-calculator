const express=require('express')
const app=express()
const path = require('path')
const userModel = require('./models/login')
const bcrypt=require('bcrypt')
const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')


app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())


app.get("/",function(req,res){
    res.render("index")
})

app.post("/register",async function(req,res){
    let {username,email,password} = req.body
    let userexists= await userModel.findOne({email: email})
    if(userexists){
        return res.render("alreadyuser")
    }
 

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let usercreated= await  userModel.create({
                username,
                email,
                password: hash
               })
             
                 res.redirect("login")
        });
    });


})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/alreadyuser",function(req,res){
    res.render("alreadyuser")
})

app.post("/home",async (req,res)=>{
    let {email,password}=req.body
    const userfind= await userModel.findOne({email: email})
    if(userfind){
        bcrypt.compare(password, userfind.password, function(err, result) {
           if(result){
            let token= jwt.sign({email: email},"secret")
            res.cookie("usertoken",token)
            res.redirect("landing")

           } 
            else res.send("something went wrong")
        });
    }
    else{
        res.send("something went wrong")
    }
    


 })


app.get("/landing",(req,res)=>{
    res.render("home")
})

app.get("/logout",(req,res)=>{
    res.cookie("usertoken","")
    res.redirect("/")
})

app.get("/earning",(req,res)=>{
    res.render("earning")
})

app.post("/submit",(req,res)=>{
    res.render("calculate",{subject: req.body.subject})
})


app.post("/calculation",(req,res)=>{
    let {one,two,three,four}=req.body
    let sum=(one*87)+(two*104.4)+(three*122)+(four*139.2)
    res.render("calculated",{total: Math.floor(sum), one,two,three,four})
})

app.get("/subjects",(req,res)=>{
    res.render("subjects")
})


app.listen(3003)