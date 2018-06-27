bitcoin = require('bitcoinjs-lib');
var wif = require('wif')

var mywif = "KzrA86mCVMGWnLGBQu9yzQa32qbxb5dvSK4XhyjjGAWSBKYX4rHx";
var decoded = wif.decode(mywif)

console.log("wif before="+mywif);
console.log("privateKey="+decoded.privateKey.toString('hex')); // p1
console.log("wif after="+wif.encode(0x80, decoded.privateKey, decoded.compressed));
console.log("compressed=", decoded.compressed);


/*
two way verification

contract
writer-> sign contract
	contract has
	- signature, publickey
	- hash of contract
	- vendor get tampered data (code verifies before running)
	- vendor tampers data (code verifies before running)

*/

//var keyPair = bitcoin.ECPair.fromWIF(mywif, bitcoin.networks.mainnet);
var keyPair = bitcoin.ECPair.makeRandom(bitcoin.networks.mainnet);
console.log("keypair compressed=", keyPair.compressed);
var onepubKey = keyPair.getPublicKeyBuffer();
var onepubKeyhex =  new Buffer(onepubKey, 'hex');

//var parsed = bitcoin.ECSignature.parseScriptSignature(onesign);
          // hashType = parsed.hashType
		  

var pubKeyHash = bitcoin.crypto.hash160(keyPair.getPublicKeyBuffer());





var signat = bitcoin.message.sign(keyPair, '1234', bitcoin.networks.mainnet);
var a1 = keyPair.getAddress();
if(bitcoin.message.verify(a1, signat, '1234', bitcoin.networks.mainnet) == true){
  console.log('passed');

}else
{
  console.log('failed');
}

