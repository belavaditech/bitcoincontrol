var options = require('options-parser');
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

var errorMessage = "Error";
options.type.int(errorMessage);
var argv = process.argv;
  console.log("length="+argv.length);
 var opts = {
  user:  { required: true },
  all:   { short: 'a', flag: true }
  };

if(argv.length < 3)
{
  console.log("error");
  options.help(opts);
  process.exit(1);
}
function errorfunc()
{
}

var result = options.parse({
  user:  { required: true },
  all:   { short: 'a', flag: true },
  host:  { short: 'h', default: 'localhost' },
  input: { short: 'i', multi: true },
  r:     { flag: true },
  db:    { default: 'test' },
  out:   { short: 'o', type: options.type.file.open.write() },
  help: {
    short: 'h',
    help: 'this help screen',
    showHelp: { 
      banner: 'options-parser example: [options]'
    }
  }
}, argv, this.errorfunc);
 

console.log(result);

