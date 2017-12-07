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
// TODO loop through the commands dir and automatically add them

storage.initSync();

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
	let errorResponse = function(type, title, message) {
		switch(type) {
			case 'set':
				title = 'Sorry, it looks like you don\'t have permission to set the time for this server. Please contact a moderator or the owner.';
				message = "Have them run `!time` for more details.";
			default:
				if(!title && !message) {
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
	if (Discord.Activity) {
		console.log("Rich presence capabilities found.");
		bot.user.setPresence({
			activity: {
				applicationID: "274543576166301696",
				application: "274543576166301696",
				name: "the " + botConfig.prefix + "time",
				type: "WATCHING",
				url: null,
				details: "Test 2",
				state: "Test 3",
				timestamps: {
					start: 1512519960,
					end: 1512520020
				},
				assets: {
					largeText: "Test 4",
					smallImage: "387913874013290497",
					largeImage: "387923476217987072",
					smallText: "Test 5"
				},
				party: {
					size: [1, 2]
				}
			}
		}).then(function (a, b) {
			console.log("Rich presence applied", bot.user.presence.activity);
		});
	} else {
		console.warn("Can't set fancy presence in this version.");
	}
	/**
	 * @desc Time function that updates the bot's nickname in every server
	 * @function
	 */
	/*function setTime() {
		bot.guilds.forEach(function (guild) {
			let fetch = guild.fetchMember ? guild.fetchMember(bot.user) : guild.member(bot.user)
			fetch.then(function(member) {
				if(member.id == bot.user.id) {
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
			});
		});
	}
	setTime();
	schedule.scheduleJob('0 * * * * *', setTime);*/
}
bot.login(botConfig.token).then(handleLogin);

function handleConnectionTroubles(problem) {
	console.warn("We just had a hiccup. Specifically:", bot.status, problem);
}
bot.on('disconnect', handleConnectionTroubles);
bot.on('reconnecting', handleConnectionTroubles);
bot.on('warn', handleConnectionTroubles);
bot.on('error', handleConnectionTroubles);