// at the top of your file
const Discord = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

// Authentication
const client = new Discord.Client();
client.once('ready', () => {
    console.log('Ready!');
});

client.login(process.env.TOKEN);

// Time commands
const timeCommand = /@@.*@@/i;

const timeOnly = /@@([^@]*)@@/i; // 00:00
const timeAndZone = /@@([^@]*)@([^@]*)@@/i; // 00:00@UTC
const timeAndZoneAndDate = /@@([^@]*)@([^@]*)@([^@]*)@@/i; // 00:00@UTC@2020-01-01

function sendTime(message, regex) {
    const match = regex.exec(message.content);
    if (match != null) {
        let url = 'https://www.starts-at.com/e/?';
        let timeString = '?';

        if (match[1] != null) {
            url += 't=' + encodeURIComponent(match[1]);
            timeString = match[1];
            if (match[2] != null) {
                url += '&tz=' + encodeURIComponent(match[2]);
                timeString += ' (' + match[2] + ')';
                if (match[3] != null) {
                    url += '&d=' + encodeURIComponent(match[3]);
                    timeString += encodeURIComponent(match[3]);
                }
            } else {
                url += '&tz=UTC';
                timeString += ' (UTC)';
            }
        }

        message.channel.send({
            embed: {
                color: 3447003,
                title: 'Show time in your zone',
                url: url,
                description: 'Host time is @ ' + timeString + '. Click the URL to see your local time.',
                footer: {
                    text: 'Syntax: @@time[@zone[@date]]@@',
                },
            },
        });

        return true;
    }
    return false;
}

client.on('message', message => {
    if (timeCommand.test(message.content)) {
        if (sendTime(message, timeOnly)) {
            return;
        } else if (sendTime(message, timeAndZone)) {
            return;
        } else if (sendTime(message, timeAndZoneAndDate)) {
            return;
        }
    }
});
