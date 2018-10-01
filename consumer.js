//consumer.js
// Kinesis Stream name
streamName = 'datafeed';

// variables
var AWS = require('aws-sdk');
var kinesisClient = new AWS.Kinesis({
    region: 'ap-southeast-1'
});

// with below setting, we can choose, the from where to start loading
ShardIteratorType = 'TRIM_HORIZON' // 'AT_TIMESTAMP' // 'AFTER_SEQUENCE_NUMBER' // 'AT_SEQUENCE_NUMBER' // 'LATEST'

kinesisClient.describeStream({
    StreamName: streamName
}, function(err, streamDesc) {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(streamDesc);
        sherds = streamDesc.StreamDescription.Shards
        sherds.forEach(shard => {
            kinesisClient.getShardIterator({
                ShardId: shard.ShardId,             // <<< Here we can get shardId
                ShardIteratorType: ShardIteratorType,
                StreamName: streamName
            }, function(err, shardIteratordata) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    kinesisClient.getRecords({
                        ShardIterator: shardIteratordata.ShardIterator
                    }, function(err, shardRecords) {
                        if (err) {
                            console.log(err, err.stack);
                        } else {
                            console.log('Data from ShardId: ' + shard.ShardId)
                            // from below piece of code we can het partitionKey and actual data
                            shardRecords.Records.forEach(record=>{
                                console.log('PartitionKey='+record.PartitionKey+' , '+'Data='+new Buffer.from(record.Data, 'base64').toString())
                            })
                        }
                    });
                }
            });
        });

    }

});