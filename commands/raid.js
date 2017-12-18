/**
	@module commands/raid
	@desc A simple raid scheduler/manager, originally developed for a friend. A secondary command available for those who want it.
	@author WizardCM <bots@wizardcm.com>
**/

/**
	@type Array
	@desc Primary command triggers
**/
module.exports.triggers = ['raid', 'join', 'leave']

/**
	@desc The function that's triggered by the onMessage event
	@type function
	@param msg {Object} Message object from Discord.js
**/
module.exports.run = function (msg) {
	// if (msg.content.indexOf("!raid") == 0 || msg.content.indexOf("!join") == 0 || msg.content.indexOf("!leave") == 0)
	let parentModule = this;
	let command = msg.content.split(' ');
	let hasPerms = new Discord.Permissions(msg.member.permissions.bitfield);
	hasPerms = hasPerms.has('ADMINISTRATOR') || hasPerms.has('MANAGE_GUILD');
	let rsvpTitle = "Ready Check by WizardCM";
	let senderUserTag = msg.member.user.username + "#" + msg.member.user.discriminator + "%%%%%%" + msg.member.user.id;
	let raidName = msg.guild.id + '_raid';
	let raidDetails = storage.getItemSync(raidName);
	let raiderCount = 0;
	try {
		if (!raidDetails) {
			raidDetails = {};
			storage.setItemSync(raidName, raidDetails);
		}
	} catch (error) {
		console.log("Failed to load data for " + msg.guild.name + ": " + error);
	}
	let joinRaid = function() {
		if (Object.keys(raidDetails).length && raidDetails.raiders.indexOf(senderUserTag) === -1) { // Not raider
			if(raidDetails.raiders.length) {
				let raiders = raidDetails.raiders.split(",");
				raiders.push(senderUserTag);
				raidDetails.raiders = raiders.join(',');
			} else {
				raidDetails.raiders = senderUserTag;
			}
			storage.setItemSync(raidName, raidDetails);
			msg.channel.send("Success! You have now been added!");
		} else if (Object.keys(raidDetails).length) {
			msg.channel.send("You've already added yourself to the next raid!");
		} else {
			msg.channel.send("There is currently no raid scheduled.");
		}
	};
	let leaveRaid = function() {
		if (Object.keys(raidDetails).length && raidDetails.raiders.indexOf(senderUserTag) !== -1) { // Is a raider
			let raiders = raidDetails.raiders.split(",");
			let index = raiders.indexOf(senderUserTag);
			raiders.splice(index, 1);
			raidDetails.raiders = raiders.join(",");
			storage.setItemSync(raidName, raidDetails);
			msg.channel.send("You have now removed yourself from the next raid.");
		} else if (Object.keys(raidDetails).length) {
			// Error not a raider
			msg.channel.send("Sorry, you had not yet joined the next raid.");
		} else {
			msg.channel.send("Sorry, there is no raid scheduled.");
		}
	};
	if (Object.keys(raidDetails).length) {
		raiderCount = 0;
		if (raidDetails.raiders.indexOf(",") === -1 && raidDetails.raiders.length) {
			raiderCount = 1;
		} else if (raidDetails.raiders.indexOf(",") !== -1) {
			raiderCount = raidDetails.raiders.split(',').length;
		}
	}
	if (command.length == 1) {
		switch(command[0]) {
			case botConfig.prefix + 'raid':
				let raidSummary = "None scheduled.";
				if (Object.keys(raidDetails).length) {
					raiderCount = 0;
					if (raidDetails.raiders.indexOf(",") === -1 && raidDetails.raiders.length) {
						raiderCount = 1;
					} else if (raidDetails.raiders.indexOf(",") !== -1) {
						raiderCount = raidDetails.raiders.split(',').length;
					}
					raidSummary = "__**" + raidDetails.description + "**__" + "\n\n" + 
								  raiderCount + " " + (raiderCount !== 1 ? "raiders have" : "raider has") + " signed up." + "\n\n" +
								  msg.member.displayName + ", you are __" + (raidDetails.raiders.indexOf(senderUserTag) !== -1 ? "already" : "not yet") + " in__ this raid." + "\n\n" +
								  "_" + "Organized by " + raidDetails.createdBy.split("#")[0] + "_" + 
								  (hasPerms && raidDetails.modifiedBy.trim().length ? "\n_Last modified by " + raidDetails.modifiedBy.split("#")[0] + "_" : "");
				}
				msg.channel.send(new Discord.RichEmbed({
					color: colorConfig.neutral,
					title: rsvpTitle,
					url: '',
					description: 'Ready check!',
					fields: [
					{
						name: 'Commands',
						value: '`!raid` Show this help menu' + '\n' +
							'`!join` Mark yourself as Available for the raid' + '\n' + // Hide if the user has already joined
							'`!leave` Remove your Available status' + '\n' +
							(hasPerms ? '`!raid new [description]` Prepare for a new raid - description can be any length, and should contain time/date' + '\n' : '') +
							(hasPerms ? '`!raid update [description]` Modify the name of the current raid without removing raiders' + '\n' : '') +
							(hasPerms ? '`!raid list` List users that have `!join`ed (without pinging them)' + '\n' : '') +
							(hasPerms ? '`!raid notify` Ping all users that have `join`ed' + '\n' : '') +
							(hasPerms ? '`!raid clear [notify]` Remove the latest raid and all that have `join`ed - add `yes` on the end to notify them' : '')
					},
					{
						name: 'Upcoming Raid Details',
						value: raidSummary // TODO, display description, who created it (and when?) and how many people have joined (and if the current user has joined)
					}
					]
				}));
				break;
			case botConfig.prefix + 'join':
				joinRaid();
				break;
			case botConfig.prefix + 'leave':
				leaveRaid();
				break;
		}
	} else {
		switch(command[1]) {
			case 'join':
				joinRaid();
				return true;
				break;
			case 'leave':
				leaveRaid();
				return true;
				break;
		}
		if (hasPerms) {
			switch(command[1]) {
				case 'new':
				case 'create':
				case 'set':
					if (!Object.keys(raidDetails).length) {
						let desc = command.join(' ').replace('!raid ' + command[1], '').trim();
						if (desc.length) {
							raidDetails = {
								createdDate: new Date(),
								createdBy: senderUserTag,
								modifiedBy: '',
								description: desc,
								raiders: '',
								leavers: ''
							}
							storage.setItemSync(raidName, raidDetails);
							msg.channel.send("New raid has been scheduled! **Raiders**, add yourselves using `!join`");
						} else {
							msg.channel.send("You need to give the raid a name/description (and a time, if you so choose).");
						}
					} else {
						msg.channel.send("Sorry, but there's already a raid scheduled. If needed, you can rename it using `!raid update [description]`.");
					}
					break;
				case 'update':
				case 'rename':
				case 'change':
				case 'modify':
				case 'reschedule':
					if (Object.keys(raidDetails).length && command.length > 2) {
						// Renaming
						let desc = command.join(' ').replace('!raid ' + command[1], '').trim();
						if(desc.length) {
							raidDetails.description = desc;
							raidDetails.modifiedBy = senderUserTag;
							storage.setItemSync(raidName, raidDetails);
							let raiderNote = (raiderCount > 0 ? "Might be a good idea to `!raid notify` existing raiders of the change. " : "");
							msg.channel.send("Raid description updated! " + raiderNote + "**Raiders**, add yourselves using `!join`");
						}
					} else if (Object.keys(raidDetails).length) {
						// Needs a new name
						msg.channel.send("You forgot to provide a new name/description (and a time, if you so choose).");
					} else {
						// No event to rename
						msg.channel.send("Sorry, but there's currently no raid scheduled. You can create one using `!raid new [description]`.");
					}
					
					break;
				case 'list':
					if (Object.keys(raidDetails).length && raidDetails.raiders.length) {
						let raiders = raidDetails.raiders.split(',');
						let raiderList = "";
						raiders.forEach(function(raider) {
							raiderList += raider.split("%%%%%%")[0] + ", ";
						});
						msg.channel.send("Currently there " + (raiderCount === 1 ? "is":"are") + " " + raidDetails.raiders.split(',').length + " raider" + (raiderCount === 1 ? "":"s") + ", listed below.\n\n" + raiderList);
					} else if (Object.keys(raidDetails).length) {
						msg.channel.send("No raiders have joined yet.");
					} else {
						msg.channel.send("As there is no raid scheduled, there are no raiders.");
					}
					break;
				case 'notify':
				case 'ready':
				case 'start':
				case 'ping':
					if (Object.keys(raidDetails).length && raidDetails.raiders.length) {
						let raiders = raidDetails.raiders.split(',');
						raiderCount = 0;
						let mentions = "";
						msg.channel.members.some(function(data) {
							if (raidDetails.raiders.indexOf(data.user.id) !== -1) {
								mentions += data.user + ' ';
								raiderCount++;
							}
							if(raiders.length == raiderCount) {
								return true;
							}
						});
						msg.channel.send(mentions + "\n\n" +
												"**" + msg.member.displayName + "** would like to remind you about **" + raidDetails.description + "**.");
					} else if (Object.keys(raidDetails).length) {
						msg.channel.send("No raiders have joined yet.");
					} else {
						msg.channel.send("As there is no raid scheduled, there are no raiders.");
					}
					break;
				case 'clear':
				case 'delete':
				case 'cancel':
				case 'remove':
					// TODO Remove event and all joined users
					if (command.length == 3 && command[2] == "yes" && raidDetails.raiders.length) {
						let raiders = raidDetails.raiders.split(',');
						raiderCount = 0;
						let mentions = "";
						msg.channel.members.some(function(data) {
							if (raidDetails.raiders.indexOf(data.user.id) !== -1) {
								mentions += data.user + ' ';
								raiderCount++;
							}
							if(raiders.length == raiderCount) {
								return true;
							}
						});
						msg.channel.send(mentions + "\n\n" +
												"**" + msg.member.displayName + "** has deleted the raid you signed up for.");
					}
					raidDetails = {};
					storage.setItemSync(raidName, raidDetails);
					msg.channel.send("Success, the raid has been deleted.");
					break;
			}
		} else {
			msg.channel.send("You don't have permission for that command.");
		}
	}
}