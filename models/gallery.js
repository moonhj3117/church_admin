var mongoose = require("mongoose");

// schema
var GallerySchema = mongoose.Schema({
  gallery_title:{type:String, required:true},                 // gallery 제목
  gallery_file_path:{type:String},                            // gallery 파일명(등록명)
  gallery_thumnail:{type:String},                              // gallery 게시 내용
  gallery_view_count:{type:String},                              // gallery View Count
  gallery_event_date:{type:Date, default:Date.now},           // gallery 촬영 날짜
  gallery_reg_date:{type:Date, default:Date.now},             // gallery 등록일
  gallery_delete_yn:{type:String},                            // gallery 삭제 여부  Y/N
  gallery_delete_date:{type:Date, default:'9999-12-31'}           // gallery 삭제 일짜, default 9999-12-31
},{
  toObject:{virtuals:true}
});

// virtuals
GallerySchema.virtual("createdDate")
.get(function(){
  return getDate(this.gallery_reg_date);
});

GallerySchema.virtual("createdTime")
.get(function(){
  return getTime(this.gallery_reg_date);
});

// model & export
var Gallery = mongoose.model("Gallery", GallerySchema);
module.exports = Gallery;

// functions
function getDate(dateObj){
  if(dateObj instanceof Date)
    return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
}

function getTime(dateObj){
  if(dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
}

function get2digits(num){
  return ("0" + num).slice(-2);
}
