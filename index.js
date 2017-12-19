'use strict';
/**
	@module timebot
	@author WizardCM <bots@wizardcm.com>
	@desc This is the core file of the bot. Run it using `npm run bot`
**/

/* System */
global.Discord        = require('discord.js');
global.bot            = new Discord.Client();

/* Dependencies */
global.fs             = require('fs');
global.moment         = require('moment');
global.timezone       = require('moment-timezone');
global.storage        = require('node-persist'); // Docs: https://github.com/simonlast/node-persist
global.schedule       = require('node-schedule');


/* Configuration */
global.botConfig      = require('./config/bot.js');
global.colorConfig    = require('./config/colors.js');
global.defaultConfig  = require('./config/defaults.js');

/* Commands */
global.timeCommand    = require('./commands/time.js');
global.raidCommand    = require('./commands/raid.js');
// TODO loop through the commands dir and automatically add them

storage.initSync();
let scheduledJob = {};

/**
 * @desc Primary event handler for incoming messages
 * @listens bot:message
 * @param msg {Object} Message object from Discord.js
 * @function
 */
function handleMessage(msg) {
	/**
	 * @desc Error response handler function, builds and displays a rich embed
	 * @param type {string} Type of error
	 * @param title {string} Custom title string
	 * @param message {message} Custom message string
	 */
	let errorResponse = function (type, title, message) {
		switch (type) {
			case 'set':
				title = 'Sorry, it looks like you don\'t have permission to set the time for this server. Please contact a moderator or the owner.';
				message = "Have them run `!time` for more details.";
			default:
				if (!title && !message) {
					title = "Something went wrong. Try again in a little while.";
					message = "If it doesn't improve, contact the bot author.";
				}
				break;
		}

		msg.channel.send(new Discord.RichEmbed({
			color: colorConfig.bad,
			title: botConfig.title,
			description: ' ',
			url: '',
			fields: [{
				name: title,
				value: message
			}]
		}));
	};
	if (msg.content.indexOf(botConfig.prefix + timeCommand.triggers[0]) == 0) {
		// TODO Expanding on proper command import, also overhaul this
		timeCommand.run(msg);
	} else if (msg.content.indexOf(botConfig.prefix + "raid") == 0 || msg.content.indexOf(botConfig.prefix + "join") == 0 || msg.content.indexOf(botConfig.prefix + "leave") == 0) {
		//raidCommand.run(msg);
	}
}
bot.on('message', handleMessage);

/**
 * @desc Initial launch function
 * @listens bot:login
 * @function
 */
function handleLogin() {
	console.log('Discord Time Bot is now online!');
	bot.user.setGame('with ' + botConfig.prefix + 'time');
	/**
	 * @desc Time function that updates the bot's nickname in every server
	 * @function
	 */
	function setTime() {
		bot.guilds.forEach(function (guild) {
			guild.fetchMember(bot.user).then(function (member) {
				if (member.id == bot.user.id) {
					let data = storage.getItemSync(guild.id);
					let thisServer = {};
					try {
						if (data) {
							thisServer = JSON.parse(data);
						}
					} catch (error) {
						console.log("Failed to load data for " + guild.name + ": " + error);
					}

					if (!Object.keys(thisServer).length) {
						member.setNickname("Not Configured");
					} else {
						// console.log(guild.name + " has: " + JSON.stringify(thisServer));
						member.setNickname(moment().tz(thisServer.zone).format(thisServer.format));
					}
				}
			}).catch(function (error) {
				console.warn("Failed fetching members.");
			});
		});
	}
	setTime();
	scheduledJob = schedule.scheduleJob('0 * * * * *', setTime);
}
function handleDisconnect() {
	if (scheduledJob) {
		scheduledJob.cancel();
	}
}

/**
 * @desc Attempt to log into Discord's servers. Handle as many errors as we can instead of crashing.
 * @function
 */
bot.login(botConfig.token);
bot.on('ready', handleLogin);
bot.on('resume', handleLogin);
bot.on('reconnecting', handleDisconnect);
bot.on('error', handleDisconnect);
bot.on('disconnect', function (event) {
	console.warn("Disconnected as Discord's servers are unreachable.");
	handleDisconnect();
});
// TODO (node:23452) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 11): Error: getaddrinfo ENOENT discordapp.com:443

// TODO (node:13582) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 4156): TypeError: Cannot read property 'options' of undefined
process.on("unhandledRejection", console.error);