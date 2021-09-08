import dotenv from 'dotenv';
import { Client, Intents, StageChannel } from 'discord.js';
import { readdirSync } from 'fs';
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
dotenv.config();
const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
let connection: VoiceConnection | null = null;
let sounds: string[] = [];
let count: number = 0;

sounds = readdirSync(`${__dirname}/../sounds/`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
    const channel: StageChannel = client.channels.cache.get('884747708324282388') as StageChannel;
    connection = joinVoiceChannel({
        channelId: '884747708324282388',
        guildId: '706452606918066237',
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => playsounds());
});

function playsounds() {
    const player: AudioPlayer = createAudioPlayer();
    const resource: AudioResource = createAudioResource(`sounds/${sounds[count]}`);
    player.play(resource);
    connection?.subscribe(player);
    player.on('error', error => console.error(error));
    player.on(AudioPlayerStatus.Idle, () => {
        count++;
        if (count >= sounds.length) count = 0;
        playsounds();
    });
}



client.login()
    .catch(error => {
        console.error(error);
        process.exit(-1);
    });