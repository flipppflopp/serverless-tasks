const axios = require('axios');

function weatherUI(bot, API_KEY){
    const intervalKeyboard = {
        inline_keyboard: [
          [
            { text: 'at intervals of 3 hour', callback_data: 'hour3' },
            { text: 'at intervals of 6 hour', callback_data: 'hour6' },
          ]
        ],
      };

    const API = 'https://api.openweathermap.org/data/2.5/forecast?lat=49.84&lon=24.03&appid=' + API_KEY

    const getWeather = (interval) => {
      setInterval(() => {
        axios.get(API)
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

    bot.on('callback_query', (query) => {
        const data = query.data;

        if (data === 'city') {
            bot.sendMessage(chatId, 'Choose interval', {
                reply_markup: intervalKeyboard
            });
        } else if (data === 'hour3') {
            getWeather(3)
        } else if (data === 'hour6') {
            getWeather(6)
        }
    });
}

module.exports = weatherUI