const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");

const listingController = require("../controller/listings.js");

//INDEX ROUTE

router.get("/", wrapAsync (listingController.index));
 
 //NEW ROUTE

 router.get("/new",isLoggedIn, (listingController.renderNewForm));


 //SHOW ROUTE

 router.get("/:id", wrapAsync (async (req,res) => {
    let {id} = req.params;
    
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
       req.flash("error","Listing does not exists!");
       res.redirect("/listings");
    }
    console.log(listing);
    console.log("listing.owner (after populate):", listing.owner);

    res.render("listings/show.ejs",{ listing });
}));
 
 
 //CREATE ROUTE

 router.post("/", validateListing ,isLoggedIn,wrapAsync (listingController.createRoute));

 //edit route
 
 router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync (listingController.editRoute));
 
 // UPDATE ROUTE
 
 router.put("/:id",validateListing, isLoggedIn,isOwner, wrapAsync (listingController.updateRoute));
 
 // DELETE ROUTE
 
 router.delete("/:id",isLoggedIn,isOwner, wrapAsync (listingController.deleteRoute));

 module.exports = router;




 