var express  = require("express");
var router   = express.Router();
var Gallery     = require("../models/gallery");
var fs       = require('fs');

// index
router.get('/', function(req, res){
  res.render("gallery/Gallery_main");
});

// New
router.get("/new", function(req, res){
  res.render("gallery/admin/new");
});

// gallery creation
router.post("/", function(req, res){
  res.render("gallery/Gallery_main");
  console.log("Gallery Creation Success");
});

module.exports = router;
