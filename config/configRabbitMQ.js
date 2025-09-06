const amqp = require("amqplib");

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://guest:guest@localhost:5672"); // or RabbitMQ server URL
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");
    return channel;
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err);
  }
}

module.exports = connectRabbitMQ;
