# PS-Discord-MinecraftServer 
A Discord bot designed to fetch data from a Minecraft server using the [Minecraft Server Status API](https://api.mcsrvstat.us/). 


## How to use 
To host this Discord bot on your own server, make sure you have [Node.js](https://nodejs.org/en) installed. Then, install the required packages by running the following command: 
```bash
 npm install discord.js axios
 ```
After installing the necessary packages, create a file named `config.json`. You can use `config.json.example` as a template for this configuration file.

### Configuration Options in `config.json`
-   **clientId**: The application ID of your Discord bot.
-   **token**: The token associated with your Discord bot.
-   **server_ip**: The IP address (and port) of the Minecraft server you want to monitor.

Make sure to replace the placeholder values in `config.json` with your actual Discord bot application ID, token, and the Minecraft server IP address. Now, you're ready to run the bot!


## Running the Bot

Execute the following command to start the bot:
```bash
node bot.js
```
<br>
For customization and improvements, feel free to explore and modify the bot according to your needs. If you encounter any issues or have suggestions for enhancements, please open an issue or contribute to the project.
