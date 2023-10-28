process.env["NTBA_FIX_350"] = 1;

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const TelegramBot = require('node-telegram-bot-api');

const envFilePath = path.resolve(__dirname, '.env');

if (fs.existsSync(envFilePath)) {
  const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
  const envVariables = envFileContent.split('\n');

  for (const envVar of envVariables) {
    const [key, value] = envVar.split('=');
    if (key && value) {
      process.env[key] = value;
    }
  }
}

const token = process.env.TOKEN.slice(0, -1);

let chat_id = parseInt(process.env.CHAT_ID)

const bot = new TelegramBot(token, {polling: true});

const program = new Command();

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