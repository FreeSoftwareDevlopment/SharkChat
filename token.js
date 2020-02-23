const hash = require("shark-hashlib");
const tg = require("token-generator");
const round=require("./round.js");
module.exports = {
  gen: username => {
    var TokenGenerator = tg({
      salt: process.env.SECRET+hash(0,username)+hash(1,round(Math.round(new Date().getTime() / 1000),100)),
      timestampMap: "pbcleftdoj" // 10 chars array for obfuscation proposes
    });
    return TokenGenerator.generate();
  },
  val:(usern,tk)=>{
    var TokenGenerator = tg({
      salt: process.env.SECRET+hash(0,usern)+hash(1,round(Math.round(new Date().getTime() / 1000),100)),
      timestampMap: "pbcleftdoj" // 10 chars array for obfuscation proposes
    });
    return TokenGenerator.isValid( tk )
  }
};
