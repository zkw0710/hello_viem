var Crypto = require('crypto');
var secp256k1= require('secp256k1');
var createKecckHash = require('keccak');

//私钥
var privateKey = Crypto.randomBytes(32);
console.log(privateKey.toString('hex'));

//公钥
var pubKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
pubKey = Buffer.from(pubKey);

//地址
var address = createKecckHash('keccak256').update(pubKey).digest().slice(-20);
console.log("0x" + address.toString('hex'));
