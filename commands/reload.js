const { Stopwatch } = require("@klasa/stopwatch");

exports.run = async (client, message, args) => {
  if (message.author.id !== "213247101314924545")
    return message.channel.send("you arent my boss! leave me alone!");
  if (args.length === 0)
    return message.channel.send(
      "You don't give me information, i cant file it. stop wasting my time >:("
    );
  const cmd = client.commands.find((x) => x.help.name.toLowerCase() === args[0].toLowerCase());
  if (!cmd) return message.channel.send("paperwork got misfiled. oops ¯\\_(ツ)_/¯");
  const msg = await message.channel.send(
    `Reloading command **${cmd.help.name}** <a:loading:730285373422305360>`
  );
  try {
    const stopwatch = new Stopwatch().start();
    await client.unloadCommand(cmd.help.name);
    await client.loadCommand(cmd.help.name);
    stopwatch.stop();
    return msg.edit(
      `<a:tickgreen:730207093797290025> Command Reloaded in **${Math.round(stopwatch.duration)}ms**`
    );
  } catch (error) {
    return msg.edit(
      `<a:tickred:730207097114984519> well fuck, looks like shits broken again... blame ittim!\n\`\`\`\n${error}\n\`\`\``
    );
  }
};

exports.help = {
  name: "reload",
};
