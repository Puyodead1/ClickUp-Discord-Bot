const fetch = require("node-fetch");
const ClickUpAPIUtils = require("../ClickUpAPIUtils");
const config = require("../config");

exports.run = async (client, message, args) => {
  if (args.length !== 1)
    return message.channel.send(
      "You don't give me information, i cant file it. stop wasting my time >:("
    );

  const task = await ClickUpAPIUtils.getTask(args[0]);
  if (task.err) return message.channel.send(`ittim threw out the paper work... ${res1.err}`);

  const folder = await ClickUpAPIUtils.getFolder(task.folder.id);
  if (!folder) return message.channel.send("faafjebhroi! folder not found!");

  const res = await ClickUpAPIUtils.deleteTask(task.id);
  if (res.err) return message.channel.send(`fdgffrg! ${res.err}`);

  return message.channel.send(
    `Deleted task \`\`${task.name}\`\` from list \`\`${folder.name}\`\`!`
  );
};

exports.help = {
  name: "deletetask",
};
