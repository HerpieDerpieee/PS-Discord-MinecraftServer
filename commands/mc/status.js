const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dgram = require('dgram');
const { server_ip, server_port } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-status')
        .setDescription('shows you some information about the minecraft server'),
    async execute(interaction) {
        try {
            const serverInfo = await getServerInfo('your_server_ip', your_server_port);

            const embed = {
                color: 0x0099ff,
                title: 'Minecraft Server Status',
                fields: [
                    { name: 'Description', value: serverInfo.description.text },
                    { name: 'Players', value: `${serverInfo.players.online}/${serverInfo.players.max}`, inline: true },
                    { name: 'Version', value: serverInfo.version.name, inline: true },
                    { name: 'Online Players', value: serverInfo.players.sample.map(player => player.name).join(', ') },
                ],
            };

            await interaction.reply({ embeds: [embed], content: '```json\n' + JSON.stringify(serverInfo, null, 2) + '```' });
        } catch (error) {
            console.error(error.message || 'Failed to retrieve Minecraft server info.');
            await interaction.reply('Failed to retrieve Minecraft server info.');
        }
    },
};


async function getServerInfo(ip, port) {
    const client = dgram.createSocket('udp4');

    // Send an empty payload for a status request
    const handshakePacket = Buffer.from([0xFE, 0xFD, 0x00]);
    client.send(handshakePacket, port, ip);

    return new Promise((resolve, reject) => {
        client.on('message', (response) => {
            if (response.slice(0, 2).equals(Buffer.from([0xFF, 0xFD])) && response.length > 35) {
                const jsonResponse = response.toString('utf8', 35);
                try {
                    const parsedResponse = JSON.parse(jsonResponse);
                    resolve(parsedResponse);
                } catch (error) {
                    reject(new Error('Failed to parse server info.'));
                }
            } else {
                reject(new Error('Failed to retrieve server info.'));
            }

            client.close();
        });

        client.on('error', (err) => {
            reject(err);
        });
    });
}