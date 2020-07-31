exports.run = async (client, message, args) => {
  const msg = await message.channel.send("fuck off, im sleeping");
  const ping =
    (msg.editedTimestamp || msg.createdAt) - (message.editedTimestamp || message.createdAt);
  return msg.edit(`Fine, its fucking ${ping}ms`);
};

exports.help = {
  name: "ping",
};
