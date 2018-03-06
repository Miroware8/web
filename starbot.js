console.log("< Starbot >");
const fs = require("fs");
const Discord = require("discord.js");
let data;
const load = () => {
	data = JSON.parse(fs.readFileSync("data/starbot.json"));
};
load();
const save = () => {
	fs.writeFileSync("data/starbot.json", JSON.stringify(data));
};
const client = new Discord.Client();
client.once("error", process.exit);
client.once("disconnect", process.exit);
const italicize = str => `_${JSON.stringify(String(str)).slice(1, -1).replace(/_/g, "\\_")}_`;
const inform = (guild, str1, str2) => {
	if(guild.available) {
		guild.owner.send(str1).catch(() => {
			const channels = guild.channels.filterArray(channel => channel.type === "text");
			let i = -1;
			const testChannel = () => {
				i++;
				if(channels[i]) {
					channels[i].send(str2).catch(testChannel);
				}
			};
			testChannel();
		});
	}
};
const permWarn = (guild, perms) => {
	const warning = `, likely because I do not have permission to ${perms}. It is recommended that you enable these permissions for me in attempt to resolve this error.`;
	inform(guild, `An error occured on ${italicize(guild.name)+warning}`, `${guild.owner} An error occured${warning}`);
};
const noStarboard = guild => {
	const warning = ", as there is nowhere for starred messages to be placed. No starboard channel has been set!\nAs a member of the Discord server with administrative permission, you can set the starboard channel by entering \">⭐\" with a channel tag after it. It is recommended that you also set permissions on that channel channel so only I can send messages in it.";
	inform(guild, `An error occured on ${italicize(guild.name)+warning}`, `${guild.owner} An error occured${warning}`);
}
const guildCreate = guild => {
	console.log(`guildCreate ${guild.id}`);
	data.guilds[guild.id] = [null, "%E2%AD%90", 5, 16755763];
	noStarboard(guild);
};
const guildDelete = guild => {
	console.log(`guildDelete ${guild.id}`);
	delete data.guilds[guild.id];
	save();
}
const sendHelp = (msg, perm) => {
	if(data.guilds[msg.guild.id][0]) {
		let help = `${msg.author} You can add ${data.guilds[msg.guild.id][2]} ${decodeURI(data.guilds[msg.guild.id][1])} ${data.guilds[msg.guild.id][2] === 1 ? "reaction" : "reactions"} to a message on this server to add it to the <#${data.guilds[msg.guild.id][0]}> channel.`;
		if(perm) {
			help += `\nAs a member of the Discord server with administrative permission, you can use the following commands.\n\n\`>⭐<channel tag>\`\nSet the starboard channel.\n\n\`>⭐<number>\`\nDefine how many reactions should get messages starred.\n\n\`>⭐<emoji, not custom>\`\nDefine which emoji should be used to star messages.\n\n\`>⭐<hex color code>\`\nChange the starred embed color.\n\n\`>⭐<message ID>\`\nStar a message manually, if the message ID is of a message in the channel you are entering the command in.\n\nYou can also prevent me from scanning messages and accepting commands in a certain channel by adding me to its channel permissions and disabling my permission to read messages (which is already disabled by default for messages posted by me).`;
		}
		help += "\nTo invite me to one of your own Discord servers, you can go to <https://miroware.io/discord/starbot/>.";
		msg.channel.send(help).catch(() => {
			permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
		});
	} else {
		noStarboard(msg.guild);
	}
};
client.once("ready", () => {
	client.user.setPresence({
		status: "online"
	});
	client.user.setActivity("Enter \">⭐\" for info.");
	const guilds = Array.from(client.guilds.keys());
	for(let i of guilds) {
		const guild = client.guilds.get(i);
		if(data.guilds[i]) {
			if(data.guilds[i][0] && !guild.channels.get(data.guilds[i][0])) {
				data.guilds[i][0] = null;
			}
		} else {
			guildCreate(guild);
		}
	}
	for(let i of Object.keys(data.guilds)) {
		console.log(i);
		if(guilds.indexOf(data.guilds[i]) === -1) {
			guildDelete(data.guilds[i]);
		}
	}
	save();
});
client.on("guildCreate", guildCreate);
client.on("guildDelete", guildDelete);
client.on("channelDelete", channel => {
	if(channel.id === data.guilds[channel.guild.id][0]) {
		data.guilds[channel.guild.id][0] = null;
		save();
	}
});
const starred = [];
const star = (msg, callback) => {
	if(data.guilds[msg.guild.id][0]) {
		console.log(`star ${msg.guild.id} ${msg.channel.id} ${msg.id}`);
		if(starred.indexOf(msg.id) === -1) {
			starred.push(msg.id);
		}
		const embed = {
			embed: {
				timestamp: msg.createdAt.toISOString(),
				color: data.guilds[msg.guild.id][3],
				footer: {
					text: `${decodeURI(data.guilds[msg.guild.id][1])} | ${msg.id}`
				},
				fields: [
					{
						name: "Author",
						value: String(msg.author),
						inline: true
					},
					{
						name: "Channel",
						value: String(msg.channel),
						inline: true
					},
					{
						name: "Message",
						value: msg.content || "..."
					}
				]
			}
		};
		if(embed.embed.fields[2].value.length > 1024) {
			embed.embed.fields[2].value = msg.content.slice(0, 1024);
			embed.embed.fields.push({
				name: "Continued",
				value: msg.content.slice(1024)
			});
		}
		const attachment = msg.attachments.first();
		if(attachment) {
			embed.embed.image = {
				url: attachment.url
			};
		}
		const starboard = msg.guild.channels.get(data.guilds[msg.guild.id][0]);
		starboard.send(embed).then(callback).catch(() => {
			permWarn(msg.guild, `read messages, send messages, ${attachment ? "and/or embed links" : "embed links, and/or attach files"}, in the ${starboard} channel or otherwise`);
		});
	} else {
		noStarboard(msg.guild);
	}
};
client.on("messageReactionAdd", reaction => {
	if(starred.indexOf(reaction.message.id) === -1 && data.guilds[reaction.message.guild.id] && reaction.message.author !== client.user && reaction.emoji.identifier === data.guilds[reaction.message.guild.id][1] && reaction.count >= data.guilds[reaction.message.guild.id][2]) {
		star(reaction.message);
	}
});
const prefix = /^> ?⭐/;
const channelTest = /^<#(\d+)>$/;
const colorTest = /^#?(?:([\da-f])([\da-f])([\da-f])|([\da-f]{6}))$/i;
client.on("message", msg => {
	if(msg.channel.type === "text" && !msg.system) {
		let content = msg.content;
		if(prefix.test(content)) {
			const perm = msg.guild.member(msg.author).hasPermission(8);
			if(perm) {
				content = content.replace(prefix, "").replace(/ /g, "");
				if(content) {
					const old1 = data.guilds[msg.guild.id][1];
					data.guilds[msg.guild.id][1] = null;
					msg.react(content).then(reaction => {
						reaction.users.remove(client.user).then(() => {
							data.guilds[msg.guild.id][1] = reaction.emoji.identifier;
							save();
							msg.channel.send(`${msg.author} Members now have to react with the ${content} emoji to get a message starred.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						});
					}).catch(err => {
						data.guilds[msg.guild.id][1] = old1;
						save();
						msg.channel.messages.fetch(content).then(msg2 => {
							star(msg2, () => {
								msg.channel.send(`${msg.author} Message #${msg2.id} has been starred.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
							});
						}).catch(() => {
							if(channelTest.test(content)) {
								const channel = content.replace(channelTest, "$1");
								if(msg.guild.channels.get(channel)) {
									data.guilds[msg.guild.id][0] = channel;
									save();
									msg.channel.send(`${msg.author} The starboard channel has been set to ${content}.`).catch(() => {
										permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
									});
								} else {
									msg.channel.send(`${msg.author} That channel does not exist, or I do not have permission to read messages in it.`).catch(() => {
										permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
									});
								}
							} else {
								const reactionCount = parseInt(content);
								if(reactionCount) {
									data.guilds[msg.guild.id][2] = Math.abs(reactionCount);
									save();
									msg.channel.send(`${msg.author} Members now have to add ${data.guilds[msg.guild.id][2]} ${data.guilds[msg.guild.id][2] === 1 ? "reaction" : "reactions"} to get a message starred.`).catch(() => {
										permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
									});
								} else if(colorTest.test(content)) {
									const code = content.replace(colorTest, "$1$1$2$2$3$3$4");
									data.guilds[msg.guild.id][3] = parseInt(code, 16);
									save();
									msg.channel.send(`The starred embed color has been changed to \`#${code}\`.\n(The default starred embed color is \`#ffac33\`.)`, {
										embed: {
											title: `#${code}`,
											color: data.guilds[msg.guild.id][3]
										}
									}).catch(() => {
										permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
									});
								} else {
									sendHelp(msg, perm);
								}
							}
						});
					});
				} else {
					sendHelp(msg, perm);
				}
			} else {
				sendHelp(msg, perm);
			}
		}
	}
});
client.login(data.token);
fs.watch(__filename, () => {
	process.exit();
});
const stdin = process.openStdin();
stdin.on("data", input => {
	console.log(eval(String(input)));
});
