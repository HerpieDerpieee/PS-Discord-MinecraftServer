const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dgram = require('dgram');
const { server_ip, server_port } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-status')
        .setDescription('shows you some information about the minecraft server'),
    async execute(interaction) {
        try {
            const serverInfo = await getServerInfo(server_ip, server_port);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Minecraft Server Status')
                .addField('Description', serverInfo.description.text)
                .addField('Players', `${serverInfo.players.online}/${serverInfo.players.max}`, true)
                .addField('Version', serverInfo.version.name, true)
                .addField('Online Players', serverInfo.players.sample.map(player => player.name).join(', '));

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error.message || 'Failed to retrieve Minecraft server info.');
            await interaction.reply('Failed to retrieve Minecraft server info.');
        }
    },
};


async function getServerInfo(ip, port) {
    const client = dgram.createSocket('udp4');

    // Send a Handshake packet to the server
    const handshakePacket = Buffer.from([0xFE, 0xFD, 0x09, 0x74, 0x65, 0x73, 0x74, 0x00, 0x4D, 0x49, 0x4E, 0x45, 0x43, 0x52, 0x41, 0x46, 0x54, 0x00]);
    client.send(handshakePacket, port, ip);

    return new Promise((resolve, reject) => {
        client.on('message', (response) => {
            if (response.slice(0, 2).equals(Buffer.from([0xFF, 0xFD])) && response.length > 35) {
                const jsonResponse = response.toString('utf8', 35);
                try {
                    const parsedResponse = JSON.parse(jsonResponse);
                    resolve(parsedResponse);
                } catch (error) {
                    reject(new Error('Failed to parse player list.'));
                }
            } else {
                reject(new Error('Failed to retrieve player list.'));
            }

            client.close();
        });

        client.on('error', (err) => {
            reject(err);
        });
    });
}