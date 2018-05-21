custom = require('./customlib');

bitcoin = require('bitcoinjs-lib');
//types = require('./node_modules/bitcoinjs-lib/src/types');
typeforce = require('typeforce');
var bufferReverse = require('buffer-reverse')

/*
 clientusage =
 {
	percentclientfees: 2, 
	fixedclientfees: 100,
        transactionfees: 10, 
 	clientaddress: '',
 }
 clientreply =
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
        maxclientfees:'',
        provideraddress: '',
        providerfixedfees: '',
	providerpercentfees: ''
        maximumvalueallowed: '',
	minimumvalueallowed: ''
	
 }


*/

function validateContract(contract, clientusage, network) 
{

}

function getTransaction(contracted_usage, userdata, network)
{

}

function doc1Upload(doc_id, doc_type, doc_hash, usagetype,clientdata, network)
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string

   return tx;
}

function doc1Check(doc_id, doc_type, doc_hash, usagetype,tx, network)
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string

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

function doc2Uploadv(creator, usagetype,clientdata,validator, network)
{
// type 1, hashofdoc is used in raw string

   return tx;
}

function doc2Validate(doc_id, doc_type, doc_hash, usagetype,validator, validatorkey, network)
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string

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
