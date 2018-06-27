var options = require('options-parser');
const fs = require('fs');
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

//console.log(JSON.stringify(creatorstub));

var argv = process.argv;

// Below options will create metadata, servercontrol, clientcontrol

// metadata will be used to program client
// dynamic clientcontrol, used as input

 var opts = {
  doccontrol:  { required: true },
  base:   { required: true , short: 'ba', default: '' },
  contractfile:   { required: true , short: 'co', default: 'contractfile' },
  vendorfile:   { required: false , short: 've', default: 'vendorfile' },
  serverfile:   { required: false , short: 'sf', default: 'serverfile' },
  clientfile:   { required: false , short: 'cf', default: 'clientfile' },
  metafile:   { required: false , short: 'mf', default: 'metafile' },
  encryption:   { required: false , short: 'en', default: '2' },
  secret:   { required: false , short: 'se', default: '' },
  };

function error()
{
  if(argv.length <7)
  {
console.log("node argsdoclib.js --doccontrol --base \'{\"name\":\"bob\", \"age\":50} ' --secret \'{\"name\":false, \"age\":true} \' ");
  options.help(opts);
  process.exit(1);
  }
}

var result = options.parse(opts, argv, error
);
 

console.log(result);
var base = JSON.parse(result.opt.base) ;
var secret = JSON.parse(result.opt.secret) ;
var contractfile = result.opt.contractfile;
if(contractfile)
{
var cont = require('./'+contractfile);
console.log(JSON.stringify(cont));
writedata(result.opt.serverfile, cont);
writedata(result.opt.clientfile, cont);
}

var vendorfile = result.opt.vendorfile;
if(vendorfile)
{
//var cont = require('./'+vendorfile);
//console.log(JSON.stringify(cont));
}

console.log(secret.name);

function writedata(file, output)
{
var content = JSON.stringify(output);

fs.writeFile(file+".json", content, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
}
