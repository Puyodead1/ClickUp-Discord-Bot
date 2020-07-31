const fetch = require("node-fetch");
const config = require("../config");

exports.run = async (client, message, args) => {
  const newArgs = message.content
    .slice(config.PREFIX.length + this.help.name.length)
    .trim()
    .split("|")
    .map((x) => x.trim());
  if (newArgs.length !== 2)
    return message.channel.send(
      "You don't give me information, i cant file it. stop wasting my time >:("
    );

  const task = await fetch(`https://api.clickup.com/api/v2/task/${newArgs[1]}`, {
    method: "GET",
    headers: {
      Authorization: config.CLICKUP_TOKEN,
    },
  }).then((res) => res.json());
  if (task.err) return message.channel.send(`ittim threw out the paper work... ${task.err}`);
  const list = await fetch(`https://api.clickup.com/api/v2/list/${task.list.id}`, {
    method: "GET",
    headers: {
      Authorization: config.CLICKUP_TOKEN,
    },
  }).then((res) => res.json());
  if (list.err) return message.channel.send(`ittim threw out the paper work... ${list.err}`);

  const status = list.statuses.find((x) => x.status.toLowerCase() === newArgs[0]);
  if (!status)
    return message.channel.send("Status not found! ensure you gave me the correct status name");

  console.log(status);
  const body = JSON.stringify(status);
  console.log(body);

  const res = await fetch(`https://api.clickup.com/api/v2/task/${newArgs[1]}`, {
    method: "PUT",
    headers: {
      Authorization: config.CLICKUP_TOKEN,
    },
    body,
  }).then((res) => res.json());
  if (res.err) return message.channel.send(`ittim threw out the paper work... ${res.err}`);

  console.log(res);

  return message.channel.send(
    `Task updated! New status: ${res.status.status}; Type: ${res.status.type}`
  );
};

exports.help = {
  name: "setstatus",
};
