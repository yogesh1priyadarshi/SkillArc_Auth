const connectRabbitMQ = require("../config/configRabbitMQ");

async function publishUserCreated(user) {
  const channel = await connectRabbitMQ();
  const exchange = "user_exchange";
  const routingKey = "user.created";

  await channel.assertExchange(exchange, "topic", { durable: true });

  const message = JSON.stringify(user);
  channel.publish(exchange, routingKey, Buffer.from(message));

  console.log("📤 Published user.created:", message);
}

module.exports = publishUserCreated;
