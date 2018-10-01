### Sample producer and consumer using plain aws-sdk for nodejs. It will help us to understands what are basic building blocks.

All the necessary IAM access to Kinesis stream should be there (on IAM user or role) to be able to use this code.

#### Producer:
- It has a form with 3 fields.
- On submit it sends data to both console & Kinesis stream
- It uses PartitionKey, so that for each key order is maintained (Kinesis maintains order of data for each key within a shard)

#### Consumer:
- Consumes data from a kinesis stream's all shards and prints data and corresponding ShardId to the console.
- We can pull data based on ShardIteratorType[line#12 in the consumer.js] (it could be all data in stream, since timestamp etc.)  
- We can consume data from selected ShardId [line#24 in the consumer.js]
- This is not a continuous running consumer. We can run it contineously, in that case we can use dynamodb or other permanent store for sequence number checkpoints.
 


#### Some notes based on AWS documents:

1. After re-sharding, new records are put into new shards, but old records are never transferred from the parent shard, and no more new records are added to the (now closed) parent shard.
2. Can explore using KPL & KCL, it encapsulates some complexities.
3. Amazon Kinesis Client Library (KCL) for Java | Python | Ruby | Node.js | .NET automatically creates an Amazon DynamoDB table for each Amazon Kinesis Application to track and maintain state information such as resharding events and sequence number checkpoints.


#### Refs:
- kinesis API reference: https://docs.aws.amazon.com/kinesis/latest/APIReference/API_Operations.html
- nodejs KCL https://github.com/awslabs/amazon-kinesis-client-nodejs

