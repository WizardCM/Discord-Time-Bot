/** 
	@module config/defaults
	@desc Provide default and fallback strings
	@author WizardCM <bots@wizardcm.com>

	Available zone names https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
	Available format codes https://momentjs.com/docs/#/displaying/
**/

/**
	@type Object
**/
module.exports = {
	/** Default bot timezone if server's location is unknown **/
	zone: "Australia/Melbourne",
	/** Default bot name format **/
	format: "ddd h:mm A",
	/** Based on server location, default timezone to speed up initial setup **/
	zones: {
		'brazil': 'America/Araguaina',
		'eu-central': 'Europe/Berlin',
		'eu-west': 'Europe/Dublin',
		'hongkong': 'Asia/Hong_Kong',
		'london': 'Europe/London',
		'russia': 'Europe/Moscow',
		'singapore': 'Asia/Singapore',
		'sydney': 'Australia/Sydney',
		'us-central': 'America/Chicago',
		'us-east': 'America/New_York',
		'us-south': 'America/Chicago',
		'us-west': 'America/Los_Angeles'
	}
};