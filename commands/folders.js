const fetch = require("node-fetch");
const ClickUpAPIUtils = require("../ClickUpAPIUtils");
const config = require("../config");

exports.run = async (client, message, args) => {
  const folders = await ClickUpAPIUtils.getFolders();
  if (folders.err) return message.channel.send(`Error fetching folders: ${folders.err}`);
  return message.channel.send(
    `Folders:\n\`\`\`\n${folders.map((x) => `• ${x.name} | ${x.id}`).join("\n")}\n\`\`\``
  );
};

exports.help = {
  name: "folders",
};
