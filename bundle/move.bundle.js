const fs = require('fs');
const moveing=[
{"thiss": __dirname+"/dist/ws.bundle.js","target":__dirname+"/../public/ws.bundle.js"},
{"thiss": __dirname+"/dist/index.pug","target":__dirname+"/../views/index.pug"}
];
function move(thiss, target){
fs.readFile(thiss, (err,data) =>{
if(err){
console.log("Move Failed");
}
fs.writeFile(target, data, (err) =>{
if(err){
console.log("Move Failed");
}else{
console.log("Move Complete file "+thiss+" to "+target);
}
});});
}
moveing.forEach(each=>{
  move(each.thiss, each.target);
});
