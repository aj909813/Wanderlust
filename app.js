const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

require('dotenv').config();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
                                                                                          
const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

const MONGO_URL = process.env.MONGODB;

main().then((res) => {
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
console.log(MONGO_URL)
async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};

app.get("/",(req,res) => {
    res.redirect("/listings");
});

 app.use(session(sessionOptions));
 app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.curruser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



// app.get("/demouser", async(req,res)=>{
//     let fakerUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registerUser = await User.register(fakerUser,"helloworld");
//     res.send(registerUser);
// });


app.all("*",(req,res,next) => {
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next) =>{

    let {statusCode=500, message="Something went Wrong"} = err;

    res.status(statusCode).render("error.ejs",{ message });
    // res.status(statusCode).send({message});
});

app.listen(8080,()=>{
    console.log(`The server is listining to port:${port}`);
});









