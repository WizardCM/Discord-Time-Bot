'use strict';

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

var me = {};

storage.initSync();

bot.on('message', msg => {
	var errorResponse = function(type, title, message) {
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
		
		msg.channel.sendEmbed({
			color: colorConfig.colorBad,
			title: botConfig.title,
			description: ' ',
			url: '',
			fields: [{
				name: title,
				value: message
			}]
		});
	};
	if (msg.content.indexOf(botConfig.prefix + timeCommand.triggers[0]) == 0) {
		// TODO Expanding on proper command import, also overhaul this
		timeCommand.run(msg);
	}
});

bot.login(botConfig.token).then(() => {
	console.log('Discord Time Bot is now online!');
	bot.user.setGame('with ' + botConfig.prefix + 'time');
	function setTime() {
		bot.guilds.forEach(function(guild) {
			guild.fetchMember(bot.user).then(function(member) {
				if(member.id == bot.user.id) {
						var data = storage.getItemSync(guild.id);
						var thisServer = {};
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
	schedule.scheduleJob('0 * * * * *', setTime);
});

