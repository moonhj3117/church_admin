var mongoose = require("mongoose");

// schema
var SermonSchema = mongoose.Schema({
  Sermontitle:{type:String, required:true},
  Sermonbody:{type:String},
  file_path:{type:String},
  Sermon_date:{type:String},
  Sermon_type:{type:String},    // 예배시간 11시 예배 : 1, 오후 예배 : 2, 수요 예배 : 3
  Sermon_type_txt:{type:String},  // 1 = 11시 예배, 2 = 오후 예배, 3 = 수요 예배
  createdAt:{type:Date, default:Date.now}
},{
  toObject:{virtuals:true}
});

// virtuals
SermonSchema.virtual("createdDate")
.get(function(){
  return getDate(this.createdAt);
});

SermonSchema.virtual("createdTime")
.get(function(){
  return getTime(this.createdAt);
});

// model & export
var Sermon = mongoose.model("sermon", SermonSchema);
module.exports = Sermon;

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
