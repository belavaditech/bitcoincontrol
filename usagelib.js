customlib = require('./customlib');

bitcoin = require('bitcoinjs-lib');
//types = require('./node_modules/bitcoinjs-lib/src/types');
typeforce = require('typeforce');
var bufferReverse = require('buffer-reverse')

/*
 partnerusage =
 {
	percentpartnerfees: 2, 
	fixedpartnerfees: 100,
        transactionfees: 10, 
 	partneraddress: '',
 }
 partnerreply =
 {
	error: '', // userdata not correct
	msg:'',
	txid: ''
 }

 userdata =
 {
	amountfortransfer: 2, 
	useraddress: '',
        targetaddress: '', 
 	balanceinaddress: '',
 }
 userreply =
 {
	error: '',
	msg:'',
	txid: ''
 }

 contract = 
 {
        maxpartnerfees:'',
        provideraddress: '',
        providerfixedfees: '',
	providerpercentfees: ''
        maximumvalueallowed: '',
	minimumvalueallowed: ''
	
 }


*/

function validateContract(contract, partnerusage, network) 
{

}

function activatedoc1(address, partnerdata ,  network)
{
 	// buildatransaction, broadcast.

}

/*
creatorstub = {
 doc_id,
 doc_type,
 doc_hash,
}

veriferstub = {
 doc_id,
 doc_type,
 doc_hash,
}

*/



function doc1Upload(creatorstub, usagetype, partnerdata, network)
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string
  var Pin = JSON.stringify(creatorstub);
  var Pinkey = Buffer.from(Pin);

   var docaddr = customlib.getBufControlCodeAddress(Pinkey, uidkey,
		bitcoin.networks.testnet);
   console.log("address2 = "+addr2);

   return docaddr;
}

function doc1Check(creatorstub, tx  , usagetype, network)
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string
   
   //return money, to sender after usage

   return true;
}

/*
creatorstub = {
 doc_id,
 doc_type,
 doc_hash,
 validatorid: '',
 validatorkey: ''
}

validatorstub = {
 doc_id,
 doc_type,
 doc_hash,
 validatorid: '',
 validatorkey: ''
}


*/

function doc2Uploadv(creatorstub, usagetype, partnerdata, network)
{
// type 1, hashofdoc is used in raw string

  var Pin = JSON.stringify(creatorstub);
  var Pinkey = Buffer.from(Pin);

  var docaddr = customlib.getBufControlCodeAddress(Pinkey, uidkey,
		bitcoin.networks.testnet);
   console.log("address2 = "+addr2);


   return docaddr;
}

function doc2Validate(addr, usagetype,validatorstub, tx, uidkey, network)
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string
   // unlock using buffer code
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var code = keyPair1.getPublicKeyBuffer();
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var amount = 141515;
var tx = compositekeylib.getTransactionForunlockBufCode (code, uidpubKey,  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log(tx.toHex());



   return tx;
}
function doc2Check(doc_id, doc_type, doc_hash, usagetype,tx,validator, network)
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string

}

function getStrControlCodeAddress(code ,network) 
{
typeforce('String', code);
var pubKeyHash = bitcoin.crypto.hash160(Buffer.from(code));
var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

var network = network || bitcoin.networks.bitcoin
var scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))

var address = bitcoin.address.fromOutputScript(scriptPubKey, network)
 return address;

}

function getBufControlCodeAddress(code ,network) 
{
typeforce('Buffer', code);
var pubKeyHash = bitcoin.crypto.hash160(code);
var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

var network = network || bitcoin.networks.bitcoin
var scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))

var address = bitcoin.address.fromOutputScript(scriptPubKey, network)
 return address;

}

function getCustomContractAddress (contract,network) 
{
typeforce('Buffer', contract);
var network = network || bitcoin.networks.bitcoin
var redeemScript = contract;
var scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))

var address = bitcoin.address.fromOutputScript(scriptPubKey, network)
 return address;

}

// from past transaction you need amount, outscriptPubKey, tx1, indextospemd, sequence
// your data needed contractinput, redeemScript
function  getTransactionForCustomContract (contractinput, redeemScript, tx1, indextospend, sequence, outscriptPubKey, amount)
{
var tx = new bitcoin.Transaction ();

var allinput = bitcoin.script.compile([contractinput, 
	redeemScript]);
txHash = bufferReverse(new Buffer(tx1, 'hex'))

tx.addInput(txHash, indextospend, sequence, allinput );
tx.addOutput(outscriptPubKey, amount);
return tx;

}

// from past transaction you need amount, outscriptPubKey, tx1, indextospemd, sequence
// your data needed buffer code
function  getTransactionForunlockBufCode (code,  tx1, indextospend, sequence, outscriptPubKey, amount)
{
typeforce('Buffer', code);
var pubKeyHash = bitcoin.crypto.hash160(code);
var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

var allinput = bitcoin.script.compile([code, 
	redeemScript]);
var tx = new bitcoin.Transaction ();
txHash = bufferReverse(new Buffer(tx1, 'hex'))

tx.addInput(txHash, indextospend, sequence, allinput );
tx.addOutput(outscriptPubKey, amount);
return tx;

}

// from past transaction you need amount, outscriptPubKey, tx1, indextospemd, sequence
// your data needed buffer code
function  getTransactionForunlockStrCode (code,  tx1, indextospend, sequence, outscriptPubKey, amount)
{
typeforce('String', code);
var pubKeyHash = bitcoin.crypto.hash160(code);
var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

var allinput = bitcoin.script.compile([code, 
	redeemScript]);
var tx = new bitcoin.Transaction ();
txHash = bufferReverse(new Buffer(tx1, 'hex'))

tx.addInput(txHash, indextospend, sequence, allinput );
tx.addOutput(outscriptPubKey, amount);
return tx;

}

module.exports = {
   getCustomContractAddress: getCustomContractAddress,
   getBufControlCodeAddress: getBufControlCodeAddress,
   getStrControlCodeAddress: getStrControlCodeAddress,
   getTransactionForunlockBufCode : getTransactionForunlockBufCode, 
   getTransactionForunlockStrCode : getTransactionForunlockStrCode, 
   getTransactionForCustomContract : getTransactionForCustomContract 
}
