process.env["NTBA_FIX_350"] = 1;

const { Command } = require('commander');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

const program = new Command();

let chat_id = process.env.CHAT_ID

program.command('send-message')
    .argument('<message>')
    .description('Sending message from bot.')
    .action(async (message_value) => {
        await bot.sendMessage(chat_id, message_value)
        process.exit(0);
    });

program.command('send-photo')
    .argument('<photo_path>')
    .description('Sending photo from bot.')
    .action(async (photo_path) => {
        const fileOptions = {
            filename: 'photo',
            contentType: 'application/octet-stream'
        };

        await bot.sendPhoto(chat_id, photo_path, {}, fileOptions)
        process.exit(0);
    });

program.parse();