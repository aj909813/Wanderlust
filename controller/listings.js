const Listing = require("../models/listing.js");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
 };


 module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

// module.exports.showRoute = async (req,res) => {
//     let {id} = req.params;
    
//     const listing = await Listing.findById(id).populate({path:"reviews",
//     populate:{
//        path:"author",
//     },
//    })
//     .populate("owner");
//     if(!listing){
//        req.flash("error","Listing does not exists!");
//        res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs",{ listing });
// };

module.exports.createRoute = (async(req,res) => {
     
    const newListing =  new Listing(req.body.listing);
    newListing.owner = req.user._id;
    console.log(req.user._id);
    console.log(newListing);
    await newListing.save();
   req.flash("success","New Listing Created!");
   res.redirect("/listings");
 });




 module.exports.editRoute = (async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing does not exists!");
       res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ listing });
});

module.exports.updateRoute = (async (req,res)=>{
    let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success","Listing updated!");
     res.redirect(`/listings/${id}`);
 });

 module.exports.deleteRoute = (async (req,res) => {
    let {id} = req.params;
    req.flash("success","Listing Deleted!");
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    
});