const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{ validatereview,isLoggedIn ,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/review.js");


//REWIEW ROUTE
//Post 
router.post("/",isLoggedIn,validatereview,wrapAsync (reviewController.postRoute));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync (reviewController.deleteRoute));


module.exports = router;