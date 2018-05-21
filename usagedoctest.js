bitcoin = require('bitcoinjs-lib');
usage = require('./usagelib');
bufferReverse = require('buffer-reverse')


// deterministic RNG for testing only
function rng () { return Buffer.from('zzzttyyzzzzzzzzzzzzzzzzzzzzzzzzz') }

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

var network = bitcoin.networks.testnet;

var uidkey = Buffer.from('a1');

var usagetype = 1; // doc in composite-key 
usage.init(contractdata, partnerdata, network);

var address = usage.doc1Upload(creatorstub, uidkey, usagetype );

var tx = usage.activate(address);
//var beforebalance = usage.balance(address);
var found = usage.doc1Check(creatorstub, tx, address);

//var afterbalance = usage.balance(address);






