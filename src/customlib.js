bitcoin = require('bitcoinjs-lib');
//types = require('./node_modules/bitcoinjs-lib/src/types');
typeforce = require('typeforce');
var bufferReverse = require('buffer-reverse')



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




function  getAllTransactionForunlockBufCode (code,   alltx, paywhom, network)
{
typeforce('Buffer', code);
var pubKeyHash = bitcoin.crypto.hash160(code);
var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

var allinput = bitcoin.script.compile([code, 
	redeemScript]);

var txb = new bitcoin.TransactionBuilder (network);

console.log("beforInput");
var hashType = 1 ;
for(var i=0; i< spendoutlist.length; i++) {
//txb.addInput(txHash, indextospend, sequence, allinput ); for compare, may be 
// check if txreverse has to be done
txb.addInput(spendoutlist[i].tx, spendoutlist[i].index, spendoutlist[i].sequence, allinput);
}

txb.addOutput(partner.outscriptPubKey, partner.amount);
txb.addOutput(provider.outscriptPubKey, provider.amount);
txb.addOutput(target.outscriptPubKey, target.amount);
txb.addOutput(returnaddr.outscriptPubKey, returnaddr.amount);

// Pay people to be paid
// balance to same address.  allocation for small fees
var tx = txb.build();

 return tx;


}

function  getAllTransactionForunlockStrCode (code,   alltx, paywhom, network)
{
typeforce('String', code);
var pubKeyHash = bitcoin.crypto.hash160(code);
var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

var allinput = bitcoin.script.compile([code, 
	redeemScript]);

var txb = new bitcoin.TransactionBuilder (globalnetwork);

console.log("beforInput");
var hashType = 1 ;
for(var i=0; i< spendoutlist.length; i++) {
//txb.addInput(txHash, indextospend, sequence, allinput ); for compare, may be 
// check if txreverse has to be done
txb.addInput(spendoutlist[i].tx, spendoutlist[i].index, spendoutlist[i].sequence, allinput);
}

txb.addOutput(partner.outscriptPubKey, partner.amount);
txb.addOutput(provider.outscriptPubKey, provider.amount);
txb.addOutput(target.outscriptPubKey, target.amount);
txb.addOutput(returnaddr.outscriptPubKey, returnaddr.amount);

// Pay people to be paid
// balance to same address.  allocation for small fees
var tx = txb.build();

 return tx;


}

function  getAllTransactionForCustomContract (contractinput,  redeemScript, alltx, outputs, network)
{
var tx = new bitcoin.Transaction ();


var allinput = bitcoin.script.compile([contractinput, 
	redeemScript]);
var txb = new bitcoin.TransactionBuilder (globalnetwork);

console.log("beforInput");
var hashType = 1 ;
for(var i=0; i< spendoutlist.length; i++) {
//txb.addInput(txHash, indextospend, sequence, allinput ); for compare, may be 
// check if txreverse has to be done
txb.addInput(spendoutlist[i].tx, spendoutlist[i].index, spendoutlist[i].sequence, allinput);
}

txb.addOutput(partner.outscriptPubKey, partner.amount);
txb.addOutput(provider.outscriptPubKey, provider.amount);
txb.addOutput(target.outscriptPubKey, target.amount);
txb.addOutput(returnaddr.outscriptPubKey, returnaddr.amount);

var tx = txb.build();

 return tx;


}


module.exports = {
   getCustomContractAddress: getCustomContractAddress,
   getBufControlCodeAddress: getBufControlCodeAddress,
   getStrControlCodeAddress: getStrControlCodeAddress,
   getTransactionForunlockBufCode : getTransactionForunlockBufCode, 
   getTransactionForunlockStrCode : getTransactionForunlockStrCode, 
   getTransactionForCustomContract : getTransactionForCustomContract ,
   getAllTransactionForunlockBufCode : getAllTransactionForunlockBufCode, 
   getAllTransactionForunlockStrCode : getAllTransactionForunlockStrCode, 
   getAllTransactionForCustomContract : getAllTransactionForCustomContract 
}
