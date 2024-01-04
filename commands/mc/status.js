const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { server_ip } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-status')
        .setDescription('Get the current server status and players'),

    async execute(interaction) {
        const SERVER_IP = `${server_ip}`;

        axios.get(`https://api.mcsrvstat.us/3/${SERVER_IP}`).then((resp) => {
            const data = resp.data;

            const embedData = {
                title: SERVER_IP,
                description: data.online ? 'Server is online' : 'Server is offline',
                color: data.online ? 0x00FF00 : 0xFF0000,
                fields: [
                    { name: 'Version', value: `${data.version} (Protocol ${data.protocol.version})`, inline: false },
                ],
                footer: { text: `${data.players.online}/${data.players.max} players` },
            };

            if (data.players && data.players.list && data.players.list.length > 0) {
                embedData.fields.push({ name: 'Player List', value: data.players.list.map(player => player.name).join('\n'), inline: false });
            } else {
                embedData.fields.push({ name: 'Player List', value: 'No players online :(', inline: false });
            }

            const embed = new EmbedBuilder(embedData);
            interaction.reply({ content: 'Server status:', embeds: [embed] });
        });
    },
};