bitcoin = require('bitcoinjs-lib');
customlib = require('./customlib');
bufferReverse = require('buffer-reverse')


// deterministic RNG for testing only
function rng () { return Buffer.from('zzzttyyzzzzzzzzzzzzzzzzzzzzzzzzz') }




  var keyPair = bitcoin.ECPair.makeRandom({ network: bitcoin.networks.testnet, rng: rng })

console.log(keyPair.toWIF());
console.log(keyPair.getAddress());
var keyPair1 = bitcoin.ECPair.fromWIF(
'cRgnQe1TQngWfnsLo9YUExBjx3iVKNHu2ZfiRcUivATuojDdzdus',
 bitcoin.networks.testnet);
var keyPair2 = bitcoin.ECPair.fromWIF(
      '91avARGdfge8E4tZfYLoxeJ5sGBdNJQH4kvjJoQFacbgx3cTMqe',
       bitcoin.networks.testnet);
var keyPair3 = bitcoin.ECPair.fromWIF(
      '91avARGdfge8E4tZfYLoxeJ5sGBdNJQH4kvjJoQFacbgww7vXtT',
 bitcoin.networks.testnet);

var onepubKey = keyPair1.getPublicKeyBuffer();
var onepubKeyhex =  new Buffer(onepubKey, 'hex');

		  

var pubKeyHash = bitcoin.crypto.hash160(keyPair1.getPublicKeyBuffer());



var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

console.log("redeemScript="+redeemScript.toString('hex'));

var scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))

console.log("sscriptpubkey="+scriptPubKey.toString('hex'));
var address = bitcoin.address.fromOutputScript(scriptPubKey, bitcoin.networks.testnet)


var addr1 = customlib.getBufControlCodeAddress(keyPair1.getPublicKeyBuffer(), bitcoin.networks.testnet);
console.log("address1 = "+addr1);
var addr2 = customlib.getStrControlCodeAddress('hello', bitcoin.networks.testnet);
console.log("address2 = "+addr2);

var addr3 = customlib.getCustomContractAddress(redeemScript, bitcoin.networks.testnet);
console.log("address3 = "+addr3);

// unlock using buffer code
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var code = keyPair1.getPublicKeyBuffer();
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var amount = 141515;
var tx = customlib.getTransactionForunlockBufCode (code,  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log(tx.toHex());




// unlock using string code
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var code = "hello"
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var amount = 141515;
var tx = customlib.getTransactionForunlockStrCode (code,  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log(tx.toHex());





// unlock using custom contract input
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var contractinput = keyPair1.getPublicKeyBuffer();
var amount = 141515;
var tx = customlib.getTransactionForCustomContract(contractinput,redeemScript,
  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log(tx.toHex());




