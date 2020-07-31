const Discord = require("discord.js");
const fs = require("fs");
const { join } = require("path");
const client = new Discord.Client();
const config = require("./config");

client.commands = new Discord.Collection();

client.loadCommand = (commandName) => {
  try {
    const props = require(join(__dirname, "commands", commandName));
    client.commands.set(commandName, props);
    console.log(`[Command Initialization] Command Loaded: ${commandName}`);
    return true;
  } catch (e) {
    throw e;
  }
};

client.unloadCommand = (commandName) => {
  let command;
  if (client.commands.has(commandName)) {
    command = client.commands.get(commandName);
  }
  if (!command) throw new Error("Command does not exist!");
  client.commands.delete(commandName);
  const mod = require.cache[require.resolve(join(__dirname, "commands", command.help.name))];
  delete require.cache[require.resolve(`${join(__dirname, "commands", command.help.name)}.js`)];
  for (let i = 0; i < mod.parent.children.length; i++) {
    if (mod.parent.children[i] === mod) {
      mod.parent.children.splice(i, 1);
      break;
    }
  }
  return true;
};

fs.readdir(join(__dirname, "events"), (err, files) => {
  if (err)
    return console.error(`[Event Initialization] Error while loading loading events: ${err}`);

  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(join(__dirname, "events", file));
    const eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(join(__dirname, "events", file))];
    console.log(`[Event Initialization] Event Loaded: ${eventName}`);
  });
});

fs.readdir(join(__dirname, "commands"), (err, files) => {
  if (err)
    return console.error(`[Command Initialization] Error while loading loading commands: ${err}`);
  files.forEach((f) => {
    if (!f.endsWith(".js")) return;
    try {
      client.loadCommand(f.split(".js")[0]);
    } catch (error) {
      console.error(error.message);
    }
  });
});

client.login(config.TOKEN);
