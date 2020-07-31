const fetch = require("node-fetch");
const ClickUpAPIUtils = require("../ClickUpAPIUtils");
const config = require("../config");

exports.run = async (client, message, args) => {
  if (args.length === 1) {
    const list = await ClickUpAPIUtils.getList(args[0]);
    if (list.err) return message.channel.send(`Error fetching list: ${list.err}`);

    const tasks = await ClickUpAPIUtils.getTasks(list.id);
    if (tasks.err) return message.channel.send(`Error fetching tasks: ${tasks.err}`);

    if (tasks.length === 0) return message.channel.send("no tasks in list");
    return message.channel.send(
      `Tasks in the list ${list.name}:\n\`\`\`\n${tasks
        .map((x) => `• ${x.name} | ${x.id}`)
        .join("\n")}\n\`\`\``
    );
  } else {
    const folders = await ClickUpAPIUtils.getFolders().then((folders) =>
      folders.filter((f) => f.lists.length !== 0)
    );
    if (folders.err) return message.channel.send(`Error fetching folders: ${folders.err}`);

    for await (const folder of folders) {
      let msg = `All tasks in folder \`\`${folder.name}\`\` (\`\`${folder.id}\`\`):\n\`\`\`\n`;
      for await (const list of folder.lists) {
        msg += "----------\n";
        msg += `• ${list.name} | ${list.id}\n`;
        const tasks = await ClickUpAPIUtils.getTasks(list.id);
        if (tasks.length === 0) msg += "No tasks!\n";
        for await (const task of tasks) {
          if (!task.name) continue;
          const ass = task.assignees ? ` | [${task.assignees.map((x) => x.username).join()}]` : "";
          msg += `  ↪ ${task.name} | ${task.id} | ${task.status.status} ${ass}\n`;
        }
      }
      msg += `\n\`\`\``;
      await message.channel.send(msg);
    }
  }
};

exports.help = {
  name: "tasks",
};
