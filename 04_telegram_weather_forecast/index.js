process.env["NTBA_FIX_350"] = 1;

const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require( "node-cache" );

const myCache = new NodeCache( { stdTTL: 60, checkperiod: 60 } );

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

const bot = new TelegramBot(token, {polling: true});


const startKeyboard = {
  inline_keyboard: [
    [
      { text: 'Forecast in Lviv', callback_data: 'city' },
      { text: 'Currency', callback_data: 'currency' }
    ]
  ],
};

const intervalKeyboard = {
  inline_keyboard: [
    [
      { text: 'at intervals of 3 hour', callback_data: 'hour3' },
      { text: 'at intervals of 6 hour', callback_data: 'hour6' },
      { text: 'Go back', callback_data: 'back' }
    ]
  ],
};

const currencyKeyboard = {
  inline_keyboard: [
    [
      { text: 'USD', callback_data: 'usd' },
      { text: 'EUR', callback_data: 'eur' },
      { text: 'Go back', callback_data: 'back' }
    ]
  ],
};

const chatId = process.env.CHAT_ID

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(chatId, 'Welcome to this awesome telegram bot!', {
    reply_markup: startKeyboard,
  });
});

const API_KEY = process.env.API_KEY
const API_WEATHER = 'https://api.openweathermap.org/data/2.5/forecast?lat=49.84&lon=24.03&appid=' + API_KEY

const getWeather = (interval) => {
  setInterval(() => {
    axios.get(API_WEATHER)
    .then((response) => {
        var currentTime = new Date();

        const timeDifference = (date1, date2) => {
          return Math.abs(date1 - date2);
        }

        let currentWeather = response.data.list.reduce((closest, item) => {
          const itemTime = new Date(item.dt_txt);
          const closestTime = new Date(closest.dt_txt);

          if (timeDifference(itemTime, currentTime) < timeDifference(closestTime, currentTime)) {
            return item;
          } else {
            return closest;
          }
        });

        bot.sendMessage(chatId, 'Weather forecast in Lviv, temperature is - ' + Math.round(currentWeather.main.temp - 273.15));
  })}, interval * 1000 * 60)
}


const API_CURRENCY = "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"

const getCurrency = (currency) => {
  let currencyCached = myCache.get( "currency" )  

  if(currencyCached == undefined){
    axios.get(API_CURRENCY)
    .then((response) => {
        let unit = response.data.find(c => c.ccy == currency.toUpperCase())

        myCache.set( "currency", response.data, 60 );

        bot.sendMessage(chatId, "The " + currency + " course is: \n\tbuy:" + parseInt(unit.buy).toFixed(2) + "\n\tsale:" + parseInt(unit.sale).toFixed(2));
  })
  } 
  else{
    let unit = currencyCached.find(c => c.ccy == currency.toUpperCase())

    bot.sendMessage(chatId, "The " + currency + " course is: \n\tbuy:" + parseInt(unit.buy).toFixed(2) + "\n\tsale:" + parseInt(unit.sale).toFixed(2));
  } 
  
  
}


bot.on('callback_query', (query) => {
  const data = query.data;

  if (data === 'city') {
    bot.sendMessage(chatId, 'Choose interval', {
      reply_markup: intervalKeyboard
    });
  } else if(data === 'currency'){
    bot.sendMessage(chatId, 'Choose currency', {
      reply_markup: currencyKeyboard
    });
  }
  else if(data === 'back'){
    bot.sendMessage(chatId, 'Welcome to weather forecast!', {
      reply_markup: startKeyboard,
    });
  }
  else if (data === 'hour3') {
    getWeather(3)
  } else if (data === 'hour6') {
    getWeather(6)
  } else if (['usd', 'eur'].includes(data)) {
    getCurrency(data)
  }
});