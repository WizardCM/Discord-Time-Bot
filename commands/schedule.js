/**
	@module commands/schedule
	@desc A rough idea for a possible future command, as an extension of the RAID command. Not actually functional
	@author WizardCM <bots@wizardcm.com>
**/

/**
	@type Array
	@desc Primary command triggers
**/
module.exports.triggers = ['schedule'];

/**
	@desc The function that's triggered by the onMessage event
	@type function
	@param msg {Object} Message object from Discord.js
**/
module.exports.run = function (msg) {
	var command = msg.content.split(' ');
	if(command.length == 1) {
		msg.channel.send(new Discord.RichEmbed({
			color: colorConfig.colorNeutral,
			title: botConfig.title,
			description: ' ',
			url: '',
			fields: [{
				name: 'Hello! Below you will find the schedule for this server, as set by your administrator. :)',
				value: "```\n" +
					" ID  | DATE               | TITLE                      \n" +
					"-----|--------------------|----------------------------\n" +
					" 0   | 10:30 PM on 25 Dec | Veteran Maw of Lorkhaj     \n" +
					" 1   | 06:00 PM on 11 Mar | The Banished Cells         \n" +
					" 2   | 04:00 PM on 19 Mar | Wayrest Sewers             \n" +
					" 3   | 11:00 PM on 28 Mar | Darkshade Caverns          \n" +
					"```\n" +
					"Max title length: 27 characters"
			}]
		}));
	} else {
		switch (command[1]) {
			case 'info':
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.colorNeutral,
					title: botConfig.title,
					description: ' ',
					url: '',
					fields: [{
						name: 'Veteran Maw of Lorkhaj',
						value: "10:30 PM on 25 Dec (3 months ago), runs fortnightly"
					},
					{
						name: 'Description',
						value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nisl leo, tincidunt congue velit in, vestibulum molestie dui. Mauris aliquam convallis urna in sagittis. Aliquam erat volutpat. Proin odio elit, feugiat eget eros in, dapibus iaculis diam. Praesent feugiat convallis dolor ac finibus. Nullam porta luctus dignissim. Pellentesque vel nisi non nulla commodo tempus et quis mauris. Nullam felis purus, semper ut tellus et, ornare hendrerit diam."
					},
					]
				}));
				break;
			case 'add':
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.colorNeutral,
					title: botConfig.title,
					description: '`!schedule add` Learn how to add a new event. Each separate argument is put on a new line (Shift+Enter on your keyboard), and anything after is considered part of the description (allows new lines). You can also tag users in the description if you\'d like them notified when the event is about to start. **Everything** goes in one message.',
					url: '',
					fields: [{
						name: 'Command Format',
						value: "```\n" + 
							"!schedule add\n" +
							"<date dd/mm/yyyy> <time hh:mm am/pm>\n" +
							"<repeat daily/weekly/fortnightly/monthly/yearly>\n" +
							"<description>\n" +
							"```\n"
					},
					{
						name: 'Command Example',
						value: "```\n" + 
							"!schedule add\n" +
							"Veteran Maw of Lorkhaj\n" +
							"25/12/2016 10:30 PM\n" +
							"fortnightly\n" +
							"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nisl leo, tincidunt congue velit in, vestibulum molestie dui. Mauris aliquam convallis urna in sagittis. Aliquam erat volutpat. Proin odio elit, feugiat eget eros in, dapibus iaculis diam. Praesent feugiat convallis dolor ac finibus. Nullam porta luctus dignissim. Pellentesque vel nisi non nulla commodo tempus et quis mauris. Nullam felis purus, semper ut tellus et, ornare hendrerit diam.\n" +
							"```\n"
					},
					]
				}));
				break;
		}
	}
}