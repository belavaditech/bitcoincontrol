 var metadata = {
   	name: '',
	phone: '',
        email: ''
 };

 var sentdata = {
   	name: 'bob',
	phone: '1234',
	address: '',
        email: ''

 };

 var newdata = {

 };

 var  sentArray = Object.keys(sentdata).map( function(key) {

      var obj = { 
		[key]: sentdata[key],
                "index": key
		};

      return  obj;

     }); 

 var  metaArray = Object.keys(metadata).map( function (key) {

      return key;

  });
 
 console.log(JSON.stringify(sentArray));
 console.log(JSON.stringify(metaArray));

 var newArray = [];

 for(var j =0; j< metaArray.length; j++)
 for(var i =0; i< sentArray.length; i++)
 {
     var key = metaArray[j];
   if(metaArray[j] == sentArray[i].index )
   {
     var t = {
	key : 'test' //sentArray[metaArray[j]]
     };
     newArray.push(t);
   }
 } 
 
 console.log(JSON.stringify(newArray));
