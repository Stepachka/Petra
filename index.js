const TelegramApi = require('node-telegram-bot-api')
const {rules} = require("nodemon/lib/rules");
const {gameOptions, againOptions, RaccoonOptions} = require('./option')
const token = '5743032399:AAFpR87QAhRjzeaAgJogpU7uN3UcLaX59b8'

const bot = new TelegramApi(token, {polling:true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Начнем игру. Я загадала число от 0 до 10, тебе нужно будет ее угадать с первого раза')
    const randomNumber = Math.floor(Math.random()*10)
    //floor округление числа в меньшую сторону
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Угадать', gameOptions)
}

const sadness = async (chatId) => {
    await bot.sendMessage(chatId, 'Так вы пребываете в печали, это грустно :(. На всех правах бота Петра я желаю вам поесть мороженного и ложиться спать');
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/17.webp')
    await bot.sendMessage(chatId, 'Если хотите енотика то, нажмите на кнопку :)', RaccoonOptions);

}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Привествие'},
        {command: '/info', description: 'Информация о мне'},
        {command: '/game', description: 'Игра'},
        {command: '/sadness', description: 'Если вы опечалены'},
    ])

    bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;

            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/1.webp');
                return bot.sendMessage(chatId, `Приветик ${msg.from.first_name} :)`);
            } else if (text === '/info') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/28.webp');
                return bot.sendMessage(chatId, `Я первый бот который сделал папа Степа, можете меня называть Пе́тра`);
            } else if (text === '/game') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/192/19.webp');
                return startGame(chatId);
            }   else if (text ==='/sadness') {
                return sadness(chatId);
            }
            bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/7.webp');
            return bot.sendMessage(chatId, 'Я тебя не понимаю ) Папа Степа еще не научил меня всему.');
        }
    )
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === '/raccoon') {
           return bot.sendPhoto(chatId, 'https://sun9-4.userapi.com/impg/RgSgPZRQlClyV6EZ1ht11b4ZIgipGIjbxAWaQg/CVX6__7i-FE.jpg?size=200x133&quality=96&sign=84f3b221c1eceed32c6279ed112500c5&type=album');
        }
        if (data === chats[chatId]) {
           await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/2.webp');
            return bot.sendMessage(chatId, `Ты победил, число - ${chats[chatId]}`, againOptions)
        } else {
            bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/9.webp');
            return bot.sendMessage(chatId, `Ты проиграл, бот загадал число -  ${chats[chatId]}`, againOptions)
        }
    })
}

start()