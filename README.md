# Discord Time Bot

Timezones are hard. This bot sits in your server's member list (the sidebar on the right) and displays the time and date for your community. It's that simple.

![Example Picture](https://i.imgur.com/oSi8lhK.png)

 > Version 1 has some known issues - primarily, if the network connection drops. It will usually continue running but will appear as 'offline' in the user list (even though the name continues updating). This will be fixed ASAP.

## Installation

1. Clone this repository

2. Run the following command
```sh
$ npm install
```

3. Copy `config/bot.js.example` to `config/bot.js`

4. Create a New App [here](https://discordapp.com/developers/applications/me) on the Discord Developers Dashboard

    * Under the **bot** section, find the 'token', you'll need this in the next step

5. Insert the token you acquired in 4 to the `config/bot.js` file. **Never share this token with anyone**

6. Change any other configuration options in `config/bot.js` as you see fit.

7. That's it! It's all configured. Now to run it

## Usage

```js
$ npm run bot
```