import { Kafka, Partitioners } from 'kafkajs';
import { randomUUID } from 'node:crypto';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'kafka-producer',
  brokers: [process.env.KAFKA_BROKER],
  sasl: {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  ssl: true,
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
await producer.connect();
await producer.send({
  topic: 'notifications.send-notification',
  messages: [
    {
      value: JSON.stringify({
        content: 'Hello',
        category: 'social',
        recipientId: randomUUID()
      })
    }
  ]
});

await producer.disconnect();
