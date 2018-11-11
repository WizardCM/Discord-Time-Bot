/**
	@module commands/time
	@desc This is the core command of the bot, controlling the configuration for the nickname.
	@author WizardCM <bots@wizardcm.com>
**/

/**
	@type Array
	@desc Primary command triggers
**/
module.exports.triggers = ['time']

/**
	@desc The function that's triggered by the onMessage event
	@type function
	@param msg {Object} Message object from Discord.js
**/
module.exports.run = function (msg) {
	let parentModule = this;
	let command = msg.content.replace(/( {2,})/g, ' ').split(' ');
	let hasPerms = new Discord.Permissions(msg.member.permissions.bitfield);
	hasPerms = hasPerms.has('ADMINISTRATOR') || hasPerms.has('MANAGE_GUILD');
	let config = storage.getItemSync(msg.guild.id);
	let thisServer = {};
	if (config) {
		thisServer = JSON.parse(config);
	}
	
	if(command.length === 1) {
		if(hasPerms) {
			let response = {
				name: 'Status'
			};
			let color = colorConfig.neutral;
			if (Object.keys(thisServer).length) {
				color = colorConfig.good;
				response.value = ":white_check_mark: All set for **" + msg.guild.name + "**. \n\nFeel free to run `!time help` for configuration & more information.";
			} else {
				color = colorConfig.bad;
				response.value = ":exclamation: Not yet configured. \n\nPlease run `!time start` to get set up. It's a super quick process.";
			}
			msg.channel.send(new Discord.RichEmbed({
				color: color,
				title: botConfig.title,
				description: ' ',
				url: '',
				fields: [response]
			}));
		} else {
			errorResponse('');
		}
	} else {
		switch(command[1]) {
			case 'start':
				if(hasPerms) {
					if(!Object.keys(thisServer).length) {
						msg.channel.send(new Discord.RichEmbed({
							color: colorConfig.good,
							title: botConfig.title,
							description: 'Initial setup for **' + msg.guild.name + '**',
							url: '',
							fields: [{
								name: 'Adding server to our database..',
								value: "It looks like this server is in **" + msg.guild.region + "**, so to speed up the process we're setting your default timezone to **" + defaultConfig.zones[msg.guild.region] + "**. \n\n" +
										"If this is incorrect, or you would like to customize the timezone further, `!time zone` will provide you with more information. You can also use `!time format` to change how the time/date is displayed. \n\n:thumbsup: That's it! You're good to go."
							}]
						}));
						let thisServer = {};
						console.log("Setting defaults for " + msg.guild.name);
						if(defaultConfig.zones[msg.guild.region]) {
							thisServer.zone = defaultConfig.zones[msg.guild.region];
						} else {
							thisServer.zone = defaultConfig.zone;
						}
						thisServer.format = defaultConfig.format;
						thisServer.owner = msg.member.displayName;
						storage.setItemSync(msg.guild.id, JSON.stringify(thisServer));
						msg.guild.fetchMember(bot.user).then(function(member) {
							member.setNickname(moment().tz(thisServer.zone).format(thisServer.format));
						});
					} else {
						errorResponse('', 'Cannot add server to database.', 'Server already exists, so this command never has to be run again.');
					}
				} else {
					errorResponse('set');
				}
				break;
			case 'zone': // TODO Ensure bot is configured for this server first
				if(hasPerms) {
					if(command[2] && hasPerms) {
						let newZone = command[2];
						if(moment.tz.zone(newZone)) {
							thisServer.zone = newZone;
							storage.setItemSync(msg.guild.id, JSON.stringify(thisServer));
							msg.channel.send(new Discord.RichEmbed({
								color: colorConfig.good,
								title: botConfig.title,
								description: ' ',
								url: '',
								fields: [{
									name: 'Timezone successfully updated',
									value: "Set to " + thisServer.zone
								}]
							}));
						} else {
							msg.channel.send(new Discord.RichEmbed({
								color: colorConfig.bad,
								title: botConfig.title,
								description: ' ',
								url: '',
								fields: [{
									name: 'Sorry, that\'s not a valid timezone. \nRun `!time zone` for full details.',
									value: "For now, we're sticking with " + thisServer.zone
								}]
							}));
						}
					} else {
						msg.channel.send(new Discord.RichEmbed({
							color: colorConfig.good,
							title: botConfig.title,
							description: ' ',
							url: '',
							fields: [{
								name: "Current timezone: " + thisServer.zone,
								value: "It's currently " + moment().tz(thisServer.zone).format(thisServer.format)
							}]
						}));
					}
				} else {
					errorResponse('set');
				}
				break;
			case 'format':
				if(hasPerms) {
					let thisCommand = "time format";
					let format = msg.content.replace(thisCommand + ' ', '').substring(1);
					if (format.length && Object.keys(thisServer).length) {
						if (format == "default") {
							thisServer.format = defaultConfig.format;
						} else {
							thisServer.format = format;
						}
						storage.setItemSync(msg.guild.id, JSON.stringify(thisServer));
						msg.channel.send("Set format to '" + thisServer.format + "' (preview: " + moment().tz(thisServer.zone).format(thisServer.format) + ")");
					} else if (Object.keys(thisServer).length) {
						msg.channel.send("Current time format (& help info): " + thisServer.format);
					} else {
						msg.channel.send("No config found.");
					}
				} else {
					errorResponse('set');
				}
				break;
			case 'server':
				let botServer = {name: 'Bot Configuration'};
				if (Object.keys(thisServer).length) {
					botServer.value = '**Timezone**: ' + thisServer.zone + '\n' + 
							'**Format**: ' + thisServer.format + '\n' +
							'**Preview**: ' + moment().tz(thisServer.zone).format(thisServer.format) + '\n' +
							'_Original config was done by ' + thisServer.owner + "_";
				} else {
					botServer.value = "No configuration found! Please run `!time start` first.";
				}
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.neutral,
					title: botConfig.title,
					url: '',
					description: '`!time server` Details about the bot\'s configuration on this server.',
					fields: [
						botServer,
						{
							name: 'Server Details',
							value: '**Name**: ' + msg.guild.name + '\n' +
								'**ID**: ' + msg.guild.id + '\n' +
								'**Region**: ' + msg.guild.region
						}
					]
				}));
				break;
			case 'help':
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.neutral,
					title: botConfig.title,
					url: '',
					description: 'Below you will find all the details on how to get this bot up and running on your server.',
					fields: [{
						name: 'Time Bot? What\'s that?',
						value: 'Timezones are hard. This bot sits in your server\'s member list (the sidebar on the right) and displays the time and date for your community. It\'s that simple.'
					},
					{
						name: 'Commands',
						value: '`!time help` Show this help menu' + '\n' +
							'`!time server` Show details about the bot\'s config' + '\n' +
							(hasPerms ? '`!time zone [region]` Set the timezone' + '\n' : '') +
							(hasPerms ? '`!time format [layout]` Set the time/date format' + '\n' : '') +
							'`!time defaults` Show the default configuration' + '\n' + 
							'`!time bot` Show general bot statistics' + '\n' + 
							'`!time in [region]` Show the time in a zone' + '\n'
					},
					{
						name: 'How do I get it on my server?',
						value: 'Nice! You can\'t just yet - the code is being perfected. But soon.'
					}
					]
				}));
				break;
			case 'bot':
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.neutral,
					title: botConfig.title,
					description: 'Global bot information',
					url: '',
					fields: [{
						name: 'Statistics',
						value: "**Uptime**: " + bot.uptime + "ms" + "\n" +
							"**Servers**: " + storage.keys().length + " configured, " + bot.guilds.array().length + " total"
					}]
				}));
				break;
			case 'defaults':
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.neutral,
					title: botConfig.title,
					url: '',
					description: '`!time defaults` Original defaults for this bot.',
					fields: [{
						name: 'Preview: ' + moment().tz(defaultConfig.zone).format(defaultConfig.format),
						value: '**Timezone**: `' + defaultConfig.zone + '`' + '\n' + 
							'**Format**: `' + defaultConfig.format + '`' + '\n' + 
							'**Regions**: `' + JSON.stringify(defaultConfig.zones, null, 2) + '`' + '\n'
					}
					]
				}));
				break;
			case 'in':
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.neutral,
					title: botConfig.title,
					description: '`!time in [zone]` Check a timezone!',
					url: '',
					fields: [{
						name: 'You requested ' + command[2],
						value: "It is currently " + moment().tz(command[2]).format('h:mm A [on] dddd')
					}]
				}));
				break;
		}
	}
}