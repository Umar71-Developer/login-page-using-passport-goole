const express = require('express');
const session = require("express-session");
const path = require('path');
const passport= require('passport');
const GoogleStrategy= require('passport-google-oauth20').Strategy;
const ejs = require('ejs');


const app = express();

app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs");


app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized:true,
    cookie:{secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  //tow line are remove due to github violations 
    callbackURL: "http://localhost:3000/auth/google/callback"
},function(accessToken, refreshToken, profile , cb){
    return cb(null, profile);
}));

passport.serializeUser(function(user , cb){
    cb(null, user)
});

passport.deserializeUser(function(obj , cb){
    cb(null, obj)
});

app.get("/login", function(req , res){
    res.render(path.join(__dirname, "login.ejs"));
});

app.get("/dashboard", (req, res) =>{
    if(req.isAuthenticated()){
        console.log(req.user)
        res.render(path.join(__dirname, "dashboard.ejs"),{user: req.user})
    }else{
        res.redirect("/login")
    }
})

app.get("/auth/google/callback" , passport.authenticate('google',{
    failureRedirect:"/login"
}),async(req , res)=>{
    res.redirect("/dashboard")
})

app.get("/auth/google", passport.authenticate('google', {scope :["profile", "email"]}))

app.get('/logout', (req, res ) =>{
    req.logOut(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/login")
        }
    })
})

app.listen(3000, ()=>{
    console.log("server is running now")
})




