compositekeylib = require('./compositekeylib');
request = require('request');
promise = require('promise');


bitcoin = require('bitcoinjs-lib');
//types = require('./node_modules/bitcoinjs-lib/src/types');
typeforce = require('typeforce');
var bufferReverse = require('buffer-reverse')

var globalcontractinfo;
var globalpartnerinfo;
var globalnetwork;

var globalbalance = 0
var globalspendabletxs = [];
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

function init(contractinfo, partnerinfo, network) 
{
   globalcontractinfo = contractinfo;
   globalpartnerinfo = partnerinfo;
   globalnetwork = network;
}

function determineactivationamount(type, amount, balance, targetaddr, returnaddr)
{
  var fees = Number(globalpartnerinfo.creator.fees);
  var amount = Number(amount);

   var shares = {
	partner: {
	outscriptPubKey: bitcoin.address.toOutputScript(globalpartnerinfo.creator.partneraddress, globalnetwork),
	amount: Number((amount * 0.2).toFixed(0))
	},
	provider: {
	outscriptPubKey: bitcoin.address.toOutputScript(globalcontractinfo.creator.provideraddress, globalnetwork),
	amount: Number((amount * 0.2).toFixed(0))
	},
	target: {
	outscriptPubKey: bitcoin.address.toOutputScript(targetaddr, globalnetwork),
	amount: Number((amount).toFixed(0))
	},
	returnaddr: {
	outscriptPubKey: bitcoin.address.toOutputScript(returnaddr, globalnetwork),
	amount: Number((balance-amount- (amount * 0.4) - fees).toFixed(0))
	}
	
   };
  return shares;
}


function determinevalidationamount(type, balance)
{
  var fees = Number(globalpartnerinfo.validator.fees);
  var balance = Number(balance);

   var shares = {
	partner: {
	outscriptPubKey: bitcoin.address.toOutputScript(globalpartnerinfo.validator.partneraddress, globalnetwork),
	amount: Number((balance * 0.2).toFixed(0))
	},
	provider: {
	outscriptPubKey: bitcoin.address.toOutputScript(globalcontractinfo.validator.provideraddress, globalnetwork),
	amount: Number((balance- (balance * 0.2) - fees).toFixed(0))
	}
	
   };
  return shares;
}

var url = 'https://api.blockcypher.com/v1/btc/test3/addrs/';

function getbalance (param)
{

var promise = new Promise(function (resolve, reject) {

    request.get(url + param + '/full', function (error, response, body) {
        if (error) {
           reject(error);
        }
        if (typeof body === 'string') {
            body = JSON.parse(body)
        console.log('Body:', body)

	 var txs = body.txs;
         globalbalance = 0;
         globalbalance = body.balance;
         globalspendabletxs = [];
         globalspendabletxs = processtx(txs, param);



        }
    resolve(globalspendabletxs);
	// return callback(null, body)
    });
  });

  return promise;
}


function dotransactioncheck (param, tx)
{

var promise = new Promise(function (resolve, reject) {

    request.get(url + param + '/full', function (error, response, body) {
        if (error) {
           reject(error);
        }
            body = JSON.parse(body)
        console.log('Body:', body)

	 var txs = body.txs;
         var status = checkiftransactionexists(txs, tx);



    resolve(status);
	// return callback(null, body)
    });
  });

  return promise;
}

function checkiftransactionexists(globaltxs, tx)
{
 var exists = false;
   for(var i=0; i< globaltxs.length; i++)
   {
     if(globaltxs[i].hash == tx)
        exists = true;
   }
  return exists;
}

function processtx(globaltxs, address)
{
console.log("process", address);
//console.log("globaltxs=", globaltxs);

var spendabletxs = [];

 for(var i=0; i< globaltxs.length; i++)
        {
          var txinput_sameaddress = false;
          var txinput_value = 0;
          for(var j=0; j< globaltxs[i].inputs.length; j++) {
                if(globaltxs[i].inputs[j].addresses[0] == address) {
                        txinput_sameaddress = true;
                        txinput_value =  globaltxs[i].inputs[j].output_value;
                }
          }


          for(var j=0; j< globaltxs[i].outputs.length; j++)
           {
              if(globaltxs[i].confirmations > 1 && !globaltxs[i].outputs[j].spent_by)
             {
                // we are expecting to spend only this address money
                // we are expecting only one transaction output we need to spend
                // This needs change when multiple transaction outputs, need to be spent

                if(globaltxs[i].outputs[j].addresses[0] == address) {
                console.log("value="+globaltxs[i].outputs[j].value);
var txout = {
   index:0,
   tx: '',
   value: '',
   sequence: 0
};

txout.value = globaltxs[i].outputs[j].value;
txout.index = j;
txout.tx = globaltxs[i].hash;
txout.sequence = globaltxs[i].inputs[0].sequence;
spendabletxs.push(txout);
                }

             }
           }
        }


console.log("spendabletxs=", spendabletxs);
 return spendabletxs;
}


function activatetx(type, amount, targetaddr, activatingkeypair)
{
 	// buildatransaction, broadcast.


var activatepromise = new Promise(function (resolve, reject) {
    var spendingaddr = activatingkeypair.getAddress() ;
    var returnaddr = spendingaddr;
    console.log("spendingaddr=",spendingaddr);
    var promise = getbalance(spendingaddr );

    promise.then(function(txsreceived) {

    var txb = new bitcoin.TransactionBuilder (globalnetwork);

    var hashType = 1 ;
    var activationshares = determineactivationamount(type, amount, globalbalance, targetaddr, returnaddr)
    if(globalbalance == 0)
    {
	console.log("globalbalance="+globalbalance);
    }    

    console.log("globalbalance="+globalbalance);
    var spendoutlist = txsreceived;
	
    for(var i=0; i< spendoutlist.length; i++) {
//txb.addInput(txHash, indextospend, sequence, allinput ); for compare, may be 
// check if txreverse has to be done
    txb.addInput(spendoutlist[i].tx, spendoutlist[i].index, spendoutlist[i].sequence);
    }
    console.log(activationshares);
    txb.addOutput(activationshares.partner.outscriptPubKey, activationshares.partner.amount);
    txb.addOutput(activationshares.provider.outscriptPubKey, activationshares.provider.amount);
    txb.addOutput(activationshares.target.outscriptPubKey, activationshares.target.amount);
    txb.addOutput(activationshares.returnaddr.outscriptPubKey, activationshares.returnaddr.amount);

    for(var i=0; i< spendoutlist.length; i++) {
	console.log("beforesign " + i);
	txb.sign(i, activatingkeypair );
    }

   var tx = txb.build();

	console.log("looks ok");
   resolve(tx);
    }).catch (function(error){

        reject(error);
	console.log("looks catch ok");
    });
  });

  return activatepromise;

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
function doc1CheckAddr(creatorstub, uidkey, address  )
{


    var Pin = JSON.stringify(creatorstub);
   var Pinkey = Buffer.from(Pin);

    var docaddr = compositekeylib.getBufControlCodeAddress(Pinkey,
                 uidkey,
                 globalnetwork);

    if(docaddr == address) return true;
    else return false;

}

function doc1Checktx(creatorstub, uidkey, tx )
{


    var Pin = JSON.stringify(creatorstub);
   var Pinkey = Buffer.from(Pin);

    var docaddr = compositekeylib.getBufControlCodeAddress(Pinkey,
                 uidkey,
                 globalnetwork);


var checkingpromise = new Promise(function (resolve, reject) {
     var promise = dotransactioncheck(docaddr );

     promise.then(function(existsornot) {




   resolve(existsornot);
    }).catch (function(error){

        reject(error);
        console.log("looks catch ok");
    });
  });

  return checkingpromise;


}


function doc1Validate(creatorstub, uidkey, address )
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string
   
   //return money, to sender after usage
    var Pin = JSON.stringify(creatorstub);
   var Pinkey = Buffer.from(Pin);
 
    var docaddr = compositekeylib.getBufControlCodeAddress(Pinkey,
                 uidkey,
                 globalnetwork);

 var type = 1;
   var paytowhom = determinevalidationamount(type, globalbalance)

var activatepromise = new Promise(function (resolve, reject) {
     var promise = getbalance(docaddr );
 
     promise.then(function(notused) {
 
     var spendoutlist = globalspendabletxs;
 
 
     console.log("globalbalance="+globalbalance);
     var spendoutlist = globalspendabletxs;

   if(globalbalance > 100) {
   var tx = compositekeylib.getAllTransactionForunlockBufCode(Pinkey, uidkey, spendoutlist, paytowhom, globalnetwork); 

   resolve(tx);
   }
    else{
     resolve(0);
    }
    }).catch (function(error){

        reject(error);
	console.log("looks catch ok");
    });
  });

  return activatepromise;

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


function sendtx(tx)
{
   var pushtx = {
    tx: tx.toHex()
   };

var config = {
 params: pushtx
};

   var lurl = 'https://api.blockcypher.com/v1/btc/test3/txs/push';
   var promise = new Promise(function (resolve, reject) {
   console.log("before push=", JSON.stringify(pushtx));

   request.post(lurl, JSON.stringify(pushtx) , function (error, response, body) {
        if (error) {
           reject(error);
        }
        resolve(body);
     });

    });

   return promise;
}




module.exports = {
   init: init,
   activatetx: activatetx,
   doc1Upload: doc1Upload,
   doc1Checktx: doc1Checktx,
   doc1CheckAddr: doc1CheckAddr,
   doc1Validate: doc1Validate,
   doc2Uploadv: doc2Uploadv,
   sendtx: sendtx,
   doc2Validate: doc2Validate
}
