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
  var fees = Number(globalpartnerinfo.fees);
  var amount = Number(amount);

   var shares = {
	partner: {
	outscriptPubKey: bitcoin.address.toOutputScript(globalpartnerinfo.partneraddress, globalnetwork),
	amount: Number((amount * 0.2).toFixed(0))
	},
	provider: {
	outscriptPubKey: bitcoin.address.toOutputScript(globalcontractinfo.provideraddress, globalnetwork),
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

         txs = body.txs;
         globalbalance = 0;
         globalbalance = body.balance;
         globalspendabletxs = [];
         globalspendabletxs = processtx(txs, param);



        }
        console.log('Status:', response.statusCode)
        console.log('Body:', body)
    resolve(body);
	// return callback(null, body)
    });
  });

  return promise;
}

function processtx(globaltxs, address)
{
console.log("process");

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
              if(!globaltxs[i].outputs[j].spent_by)
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


console.log(spendabletxs);
 return spendabletxs;
}


function activatetx(type, amount, targetaddr, activatingkeypair)
{
 	// buildatransaction, broadcast.


var activatepromise = new Promise(function (resolve, reject) {
    var spendingaddr = activatingkeypair.getAddress() ;
    var returnaddr = spendingaddr;
    var promise = getbalance(spendingaddr );

    promise.then(function(notused) {

    var txb = new bitcoin.TransactionBuilder (globalnetwork);

    var hashType = 1 ;
    var activationshares = determineactivationamount(type, amount, globalbalance, targetaddr, returnaddr)
    if(globalbalance == 0)
    {
	console.log("globalbalance="+globalbalance);
    }    

    console.log("globalbalance="+globalbalance);
    var spendoutlist = globalspendabletxs;
	
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

function doc1Check(creatorstub, tx, address  )
{

}
function doc1validate(creatorstub, tx, address )
{
// type 1, hashofdoc is used in raw string
// type 2, hash of hashofdoc is used in  string
   
   //return money, to sender after usage
   var paytowhom = determinevalidationamount();

   var tx = compositekeylib.getAllTransactionForunlockBufCode(validatorstub, uidkey, alltx, paytowhom, globalnetwork); 


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
   activatetx: activatetx,
   doc1Upload: doc1Upload,
   doc1Check: doc1Check,
   doc2Uploadv: doc2Uploadv,
   doc2Validate: doc2Validate
}
