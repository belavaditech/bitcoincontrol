compositekeylib = require('./compositekeylib');

bitcoin = require('bitcoinjs-lib');
//types = require('./node_modules/bitcoinjs-lib/src/types');
typeforce = require('typeforce');
var bufferReverse = require('buffer-reverse')

var globalcontract;
var globalpartnerinfo;
var globalnetwork;

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

function init(contract, partnerinfo, network) 
{
   globalcontract = contract;
   globalparnerinfo = partnerinfo;
   globalnetwork = network;
}

function activate(address)
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



function doc1Upload(creatorstub, uidkey, usagetype  )
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string
  var Pin = JSON.stringify(creatorstub);
  var Pinkey = Buffer.from(Pin);

   var docaddr = compositekeylib.getBufControlCodeAddress(Pinkey, 
		uidkey,
		globalnetwork);
   console.log("docaddr = "+docaddr);

   return docaddr;
}

function doc1Check(creatorstub, tx  , address )
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

function doc2Uploadv(creatorstub, uidkey, usagetype )
{
// type 1, hashofdoc is used in raw string

  var Pin = JSON.stringify(creatorstub);
  var Pinkey = Buffer.from(Pin);

  var docaddr = compositekeylib.getBufControlCodeAddress(Pinkey, uidkey,
		bitcoin.networks.testnet);
   console.log("address2 = "+addr2);


   return docaddr;
}

function doc2Validate(addr, usagetype,validatorstub, tx, uidkey )
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string
   // unlock using buffer code
/*
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var code = keyPair1.getPublicKeyBuffer();
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var amount = 141515;
var tx = compositekeylib.getTransactionForunlockBufCode (code, uidpubKey,  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log(tx.toHex());



   return tx;
*/
}


module.exports = {
   init: init,
   activate: activate,
   doc1Upload: doc1Upload,
   doc1Check: doc1Check,
   doc2Uploadv: doc2Uploadv,
   doc2Validate: doc2Validate
}
