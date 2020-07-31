const fetch = require("node-fetch");
const config = require("../config");
const ClickUpAPIUtils = require("../ClickUpAPIUtils");

exports.run = async (client, message, args) => {
  const newArgs = message.content
    .slice(config.PREFIX.length + this.help.name.length)
    .trim()
    .split("|")
    .map((x) => x.trim());
  if (newArgs.length !== 4)
    return message.channel.send(
      "You don't give me information, i cant file it. stop wasting my time >:("
    );

  const folders = await ClickUpAPIUtils.getFolders();
  if (!folders || folders.err) return message.channel.send("Error fetching folders!");

  let folder = folders.find((x) => x.name.toLowerCase() === newArgs[2] || x.id === newArgs[2]);
  if (!folder)
    return message.channel.send("cant find folder or a folder that contains the specified list");
  const list = folder.lists.find((x) => x.name.toLowerCase() === newArgs[3] || x.id === newArgs[3]);

  if (!list) return message.channel.send(`invalid list`);
  else if (list.err) return message.channel.send(`error getting list: ${list.err}`);

  const res = await ClickUpAPIUtils.createTask(list.id, newArgs[0], newArgs[1]);
  if (res.err) return message.channel.send(`fdgffrg! ${res.err}`);

  return message.channel.send(
    `Created a new task in folder \`\`${folder.name}\`\` under the list \`\`${list.name}\`\`; Task id: \`\`${res.id}\`\``
  );
};

exports.help = {
  name: "newtask",
};
