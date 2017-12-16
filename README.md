# Discord Time Bot

Timezones are hard. This bot sits in your server's member list (the sidebar on the right) and displays the time and date for your community. It's that simple.

![Example Picture](https://i.imgur.com/oSi8lhK.png)

## Installation

1. Clone this repository

2. Run the following command
```sh
$ npm install
```

3. Copy `config/bot.js.template` to `config/bot.js`

4. Create a New App [here](https://discordapp.com/developers/applications/me) on the Discord Developers Dashboard

    * Under the **bot** section, find the 'token', you'll need this in the next step

5. Insert the token you acquired in 4 to the `config/bot.js` file. **Never share this token with anyone**

6. Change any other configuration options in `config/bot.js` as you see fit.

7. That's it! It's all configured. Now to run it

## Usage

```sh
$ npm run bot
```
Once launched, the bot can be invited to (and configured for) as many servers as you like!

1. Go back to your app [here](https://discordapp.com/developers/applications/me) on the Discord Developers Dashboard

2. Select your app, find the client ID and copy it

3. Append the client ID from step 2 onto the very end of the following URL
    * **https://discordapp.com/oauth2/authorize?scope=bot&permissions=67177536&client_id=**
    * This link can safely be shared with any other server admins that want to add your bot to their own server
    * The permissions the bot requests are the ONLY ones that it requires (it especially needs to be able to edit its own nickname!)
    * By default, the bot can only see, read, and appear in channels that @everyone has access to - meaning if you want to be able to see it in a staff/admin/moderator channel, you will have to manually add those permissions to the bot in your server

4. Copy the URL and open it in a new browser tab

5. Select the server and click 'Authorize'

6. That's the basic part done! Now go to your server and you should see your bot in the user list

7. Run the `time` command with the prefix set in the config (default is `?time`) and follow the instructions

8. You're all set! Now you never have to worry about having to explain what "7PM CST" is to Europeans, or vice versa
    
