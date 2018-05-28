bitcoin = require('bitcoinjs-lib');
usage = require('./usagedoclib');
contractinfo = require('./contract.json');
partnerinfo = require('./partner.json');
bufferReverse = require('buffer-reverse')



var creatorstub = {
 doc_id: 'doc12',
 doc_type: 'pdf',
 doc_hash: '262772827acb72727'
}


// deterministic RNG for testing only
function rng () { return Buffer.from('zzzttyyzzzzzzzzzzzzzzzzzzzzzzzzz') }

var network = bitcoin.networks.testnet;

var activatingkeypair = bitcoin.ECPair.makeRandom({ network: network, rng: rng })

console.log(activatingkeypair.toWIF());





var uidkey = Buffer.from('a56677b666c88777a1');

var usagetype = 1; // doc in composite-key 
usage.init(contractinfo, partnerinfo, network);

var address = usage.doc1Upload(creatorstub, uidkey, usagetype );

var amount = 2000;
var txpromise = usage.activatetx(usagetype, amount, address, activatingkeypair); // -> popup for partner to send money, amount
 txpromise.then(function(tx) {
  console.log(tx.toHex());
  usage.sendtx(tx).then(function(tx1) {

  console.log("sending=", JSON.stringify(tx1));
 }).catch (function(error){
  console.log(error);
 });
 }).catch (function(error){
  console.log(error);
});;

var txpromise = usage.doc1Validate(creatorstub, uidkey, address);
 txpromise.then(function(tx) {
  if(tx != 0)
    console.log(tx.toHex());
  else {  
     console.log("no balance to withdraw");
   }
 }).catch (function(error){

  console.log(error);
});;

var checkaddr= usage.doc1CheckAddr(creatorstub, uidkey, address);
  if(checkaddr == true)
    console.log("Address exists"); 
  else {  
    console.log("Address does not exist"); 
   }


var tx = "232dbdfb84a4d79af6bbbc8c6b8db06f67e7ad30918a9591617bb0b279e2c866";
var txcheckpromise = usage.doc1Checktx(creatorstub, uidkey, tx);
 txcheckpromise.then(function(tx) {
  if(tx == true)
    console.log("Transaction exists"); 
  else {  
    console.log("Transaction does not exist"); 
   }
 }).catch (function(error){

  console.log(error);
});;
//var beforebalance = usage.balance(address);
//var beforebalance = usage.balance(address);
// var found = usage.doc1Check(creatorstub, tx, address);

//var afterbalance = usage.balance(address);






