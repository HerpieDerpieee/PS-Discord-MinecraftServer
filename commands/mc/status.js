const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { server_ip } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-status')
        .setDescription('Get the current server status and players'),

    async execute(interaction) {
        const serverURL = `https://api.mcstatus.io/v2/status/java/${server_ip}`
        let embedData;
        axios.get(serverURL)
            .then((response) => {
                const data = response.data;
                console.log(data.players.list)
                if (data.online === true){
                    embedData = {
                        title: server_ip,
                        description: data.online ? 'Server is online' : 'Server is offline',
                        color: data.online ? 0x00FF00 : 0xFF0000,
                        fields: [
                            { name: 'Version', value: `${data.version.name_clean} (Protocol ${data.version.protocol})`, inline: false },
                        ],
                        footer: { text: `${data.players.online}/${data.players.max} players` },
                    };

                    if (data.players && data.players.list && data.players.list.length > 0) {
                        embedData.fields.push({ name: 'Player List', value: data.players.list.map(player => player.name_clean).join('\n'), inline: false });
                    } else {
                        embedData.fields.push({ name: 'Player List', value: 'No players online :(', inline: false });
                    }

                } else {
                    embedData = {
                        title: SERVER_IP,
                        description: data.online ? 'Server is online' : 'Server is offline',
                        color: data.online ? 0x00FF00 : 0xFF0000,
                    };
                }

                const embed = new EmbedBuilder(embedData);
                interaction.reply({ content: 'Server status:', embeds: [embed] });
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });

    },
};