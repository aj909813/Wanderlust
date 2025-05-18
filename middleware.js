const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()) {
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
     if(!listing.owner._id.equals(res.locals.curruser._id)){
         req.flash("error","you are not  onwer of the listing ");
        return res.redirect(`/listings/${id}`);
     }
     next();
};

module.exports.validateListing = (req,res,next)  => {
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validatereview = (req,res,next)  => {
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id, reviewId} = req.params;
    let Review = await review.findById(reviewId);
     if(!Review.author.equals(res.locals.curruser._id)){
         req.flash("error","you are not  author of the review");
        return res.redirect(`/listings/${id}`);
     }
     next();
};






