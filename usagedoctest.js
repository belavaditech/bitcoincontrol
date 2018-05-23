bitcoin = require('bitcoinjs-lib');
usage = require('./usagelib');
contract = require('./contract.json');
partner = require('./partner.json');
bufferReverse = require('buffer-reverse')



var creatorstub = {
 doc_id: 'doc12',
 doc_type: 'pdf',
 doc_hash: '262772827acb72727'
}
var partnerdata = {
  name:'partner1'
};
var contractdata = {
  name:'contract'
};


// deterministic RNG for testing only
function rng () { return Buffer.from('zzzttyyzzzzzzzzzzzzzzzzzzzzzzzzz') }

var network = bitcoin.networks.testnet;

var activatingkeypair = bitcoin.ECPair.makeRandom({ network: network, rng: rng })

console.log(activatingkeypair.toWIF());





var uidkey = Buffer.from('a1');

var usagetype = 1; // doc in composite-key 
usage.init(contractdata, partnerdata, network);

var address = usage.doc1Upload(creatorstub, uidkey, usagetype );

var tx = usage.activatetx(address, activatingkeypair); // -> popup for partner to send money, amount

//var beforebalance = usage.balance(address);
var found = usage.doc1Check(creatorstub, tx, address);

//var afterbalance = usage.balance(address);






