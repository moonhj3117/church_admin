var express  = require("express");
var router   = express.Router();
var Sermon     = require("../models/Sermon");
var fs       = require('fs');
var GoogleURL = require( 'google-url' );


var const_sermont_type_text1 = "11시 예배";
var const_sermont_type_text2 = "오후 예배";
var const_sermont_type_text3 = "수요 예배";
var const_domain = process.env.DOMAIN;
var limit = 8;              // 설교 리스트 한페이지 최대 갯수

// Index
router.get("/", function(req, res){
  var page = Math.max(1,req.query.page);
  Sermon.count({Sermon_type:"1"},function(err,count){
    if(err) return res.json({success:false, message:err});
    var skip = (page-1)*limit;
    var maxPage = Math.ceil(count/limit);
    Sermon.find({Sermon_type:"1"})    // 11시 예배가 첫 화면으로 고정되어 있기에 type 을 1 던져서 데이터를 갖고 온다
    .sort("-Sermon_date").skip(skip).limit(limit)
    .exec(function(err, Sermons){
      if(err) return res.json(err);
      res.render("posts/index", {sermons:Sermons, page:page, maxPage:maxPage, id:1});
    });
  });
});

// Index
router.get("/index/:id", function(req, res){
  var page = Math.max(1,req.query.page);
  Sermon.count({Sermon_type:req.params.id},function(err,count){
    if(err) return res.json({success:false, message:err});
    var skip = (page-1)*limit;
    var maxPage = Math.ceil(count/limit);
    Sermon.find({Sermon_type:req.params.id})    // 11시 예배가 첫 화면으로 고정되어 있기에 type 을 1 던져서 데이터를 갖고 온다
    .sort("-Sermon_date").skip(skip).limit(limit)
    .exec(function(err, Sermons){
      if(err) return res.json(err);
      res.render("posts/index", {sermons:Sermons, page:page, maxPage:maxPage, id:req.params.id});
    });
  });
});


// New
router.get("/new", function(req, res){
  res.render("posts/admin/new");
});

// shorter test
router.get("/clip", function(req, res){
  res.render("posts/clipboardtest");
});
// create
router.post("/", function(req, res){
  var sermon_data = new Sermon();
  sermon_data.Sermontitle = req.body.title;
  sermon_data.Sermonbody = req.body.body;
  sermon_data.file_path = req.body.file_path;
  sermon_data.Sermon_date = req.body.sermon_date;
  sermon_data.Sermon_type = req.body.selectpicker;
  switch (req.body.selectpicker) {
    case "1":
        sermon_data.Sermon_type_txt = const_sermont_type_text1;
      break;
    case "2":
        sermon_data.Sermon_type_txt = const_sermont_type_text2;
      break;
      case "3":
        sermon_data.Sermon_type_txt = const_sermont_type_text3;
      break;
  }

  Sermon.create(sermon_data, function(err, sermon){
    if(err) return res.json(err);
    res.redirect('/posts');
  });
});

// show
router.get("/:id", function(req, res){
  var short_url = null;
  Sermon.findOne({_id:req.params.id}, function(err, sermon){
    if(err) return res.json(err);

    // google shorter api 이용 대박이네!!!
    var lognUrl = const_domain + req.params.id;
    googleUrl = new GoogleURL({key:process.env.GOOGLEAPI});
    googleUrl.shorten( lognUrl , function( err, shortUrl ) {
      res.render("posts/show", {sermon:sermon, url:shortUrl});
    });
  });
});

// edit
router.get("/:id/edit", function(req, res){
  Sermon.findOne({_id:req.params.id}, function(err, sermon){
    if(err) return res.json(err);
    res.render("posts/admin/edit", {sermon:sermon});
  });
});

// update
router.put("/:id", function(req, res){
  var sermon_data = new Sermon();
  sermon_data._id = req.params.id;
  sermon_data.Sermontitle = req.body.title;
  sermon_data.Sermonbody = req.body.body;
  sermon_data.file_path = req.body.file_path;
  sermon_data.Sermon_date = req.body.sermon_date;
  sermon_data.Sermon_type = req.body.selectpicker;
  switch (req.body.selectpicker) {
    case "1":
        sermon_data.Sermon_type_txt = const_sermont_type_text1;
      break;
    case "2":
        sermon_data.Sermon_type_txt = const_sermont_type_text2;
      break;
      case "3":
        sermon_data.Sermon_type_txt = const_sermont_type_text3;
      break;
  }
  Sermon.findOneAndUpdate({_id:req.params.id}, sermon_data, function(err, sermon){
    if(err) return res.json(err);
    res.redirect("/posts/"+req.params.id);
  });
});

// destroy
router.delete("/:id", function(req, res){
  Sermon.remove({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});

module.exports = router;
