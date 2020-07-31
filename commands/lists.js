const fetch = require("node-fetch");
const ClickUpAPIUtils = require("../ClickUpAPIUtils");
const config = require("../config");

exports.run = async (client, message, args) => {
  if (args.length === 1) {
    const folder = await ClickUpAPIUtils.getFolder(args[0]);
    if (folder.err) return message.channel.send(`Error fetching folder: ${folder.err}`);

    const lists = await ClickUpAPIUtils.getLists(folder.id);
    if (lists.err) return message.channel.send(`Error fetching lists: ${lists.err}`);

    return message.channel.send(
      `Lists in the folder ${folder.name}:\n\`\`\`\n${lists
        .map((x) => `• ${x.name} | ${x.id}`)
        .join("\n")}\n\`\`\``
    );
  } else {
    const folders = await ClickUpAPIUtils.getFolders();
    if (folders.err) return message.channel.send(`Error fetching folders: ${folder.err}`);

    let msg = "";
    for (const folder of folders) {
      const lists = folder.lists;
      msg += `\n--------\nFolder: ${folder.name} | ${folder.id}\n${lists
        .map((l) => `  • ${l.name} | ${l.id}`)
        .join("\n")}`;
    }

    return message.channel.send(`All lists:\n\`\`\`\n${msg}\n\`\`\``);
  }
};

exports.help = {
  name: "lists",
};
