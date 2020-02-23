const fs = require('fs');
fs.readFile(__dirname+"/index.pug", (err,data) =>{
if(err){
console.log("Move Failed");
}
fs.writeFile(__dirname+"/dist/index.pug", data, (err) =>{
if(err){
console.log("Move Failed");
}else{
console.log("Move Complete");
}
});});
