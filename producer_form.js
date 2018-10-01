// producer_form.js
// Kinesis Stream name
streamName = 'datafeed';

// libraries
const express = require('express');
const bodyParser = require('body-parser');

// generic variables and settings
var AWS = require('aws-sdk');
var kinesisClient = new AWS.Kinesis({region:'ap-southeast-1'});
const app = express();
streamName='datafeed';

// functions
function printConsole(id, name, desc) {
  console.log('ID:'+id);
  console.log('NAME:'+name);
  console.log('DESCRIPTION:'+desc);
}

function pushToKinesis(postId, postName, postDesc, kinesisClient, streamName) {
  var recordData = [];
  var record = {
                Data: JSON.stringify({
                    id: postId,
                    name: postName,
                    desc: postDesc
                }),
                PartitionKey: postId
               };
  
  recordData.push(record);

  // upload data to Amazon Kinesis
  kinesisClient.putRecords({
       Records: recordData,
       StreamName: streamName
     },function(err, data) {
         if (err) {
            console.error(err);
         }
     }
  );

  recordData = [];
  
  console.log('Data Sent to Kinesis');

}


// main
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) =>  response.sendFile(`${__dirname}/index.html`));

app.post('/', (request, response) => {
  const postId = request.body.id;
  const postName = request.body.name;
  const postDesc = request.body.desc;
  
  printConsole(postId, postName, postDesc);
  pushToKinesis(postId, postName, postDesc, kinesisClient, streamName)

  response.send('ID:'+postId+ '     NAME:' +postName+ '     DESCRIPTION:'+postDesc);

});

app.listen(3000, () => console.info('Application running on port 3000'));


