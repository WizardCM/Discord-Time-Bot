/** 
	* @module config/defaults
	* @author WizardCM <bots@wizardcm.com>
	* @desc Provide default and fallback strings.
	* [Available zone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
	* [Available format codes](https://momentjs.com/docs/#/displaying/).
*/

/**
	@type {Object}
*/
module.exports = {
	/** 
	 * @desc Default bot timezone if server's location is unknown
	 * @default "Australia/Melbourne"
	 */
	zone: "Australia/Melbourne",
	/** 
	 * @desc Default bot name format
	 * @default "ddd h:mm A"
	 */
	format: "ddd h:mm A",
	/** 
	 * @desc Based on server location, default timezone to speed up initial setup
	 * @type {Object.<string, string>}
	 * @default
	 */
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