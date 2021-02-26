require('https').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
});
const { Telegraf } = require('telegraf');
const bot = new Telegraf('1315937067:AAGP8hYqwgv_QayUTpIXubH5v0SFkRmZCIk');



let chats = {};

function addUser(user, chatID){
    if(!chats[chatID]){
        chats[chatID] = {};
    }
    if(!chats[chatID][user.id]) {
        chats[chatID][user.id] = {
            id: user.id,
            first_name: user.first_name,
        };
        chats[chatID][user.id].dickLengh = 0;
        chats[chatID][user.id].lastGameTime = {};
    }
}

function topDick(chatID){
    let topDick = 'Рейтинг гравців:\n\n';
    Object
        .values(chats[chatID])
        .sort((a, b) => {return b.dickLengh - a.dickLengh})
        .forEach((user, index, array) =>{
            topDick += `${index + 1}. ${user.first_name} - ${user.dickLengh == 0? 'не має песюна': user.dickLengh + "см"}.\n`;
        });
    return topDick;
}

bot.start((ctx) => {
    let userID = ctx.update.message.from.id;
    //console.log(ctx.update.message.from);
    console.log(ctx);
    return ctx.reply("[inline mention of a user](tg://user?id=669943226)");
    /*if(userID == 669943226 || userID == 991818500){
        return ctx.reply(ctx.update.message.from.first_name + ', бог');
    }
    else {
        console.log(ctx.update.message.from);
        return ctx.reply(ctx.update.message.from.first_name + ', не бог');
    }*/
});

bot.command('dickplay', (ctx) => {
    let now = new Date();
    let chatID = String(ctx.update.message.chat.id);
    let userID = ctx.update.message.from.id;
    addUser(ctx.update.message.from, chatID);
    //взяти юзєра з бд
    let user = chats[chatID][userID];
    console.log(chats);
    //console.log(user);
    if(now.getDate() == user.lastGameTime.day && now.getMonth() == user.lastGameTime.month){
        return ctx.reply(
            user.first_name + `, ти вже грав сьогодні.\n`+
            `Продовжуй грати через ${24 - now.getHours()}год. ${60 - now.getMinutes()} хв.`
        );
    }
    else{
        user.lastGameTime.day = now.getDate();
        user.lastGameTime.month = now.getMonth();
        let rnd = Math.round(Math.random() * 15 - 5);
        if(rnd == 0){
            return ctx.reply(
                user.first_name + `, твій песюн не змінився.\n` +
                `Продовжуй грати через ${24 - now.getHours()}год. ${60 - now.getMinutes()}хв.`
            );
        }
        if(rnd > 0){
            user.dickLengh += rnd;
            return ctx.reply(
                user.first_name + `, твій песюн виріс на ${rnd}см.\n` +
                `Тепер його довжина ${user.dickLengh}см.`+
                `Продовжуй грати через ${24 - now.getHours()}год. ${60 - now.getMinutes()} хв.`
            );
        }
        if(rnd < 0){
            if(user.dickLengh + rnd <= 0){
                user.dickLengh = 0;
                return ctx.reply(
                    user.first_name + `, в тебе немає песюна.\n` +
                    `Продовжуй грати через ${24 - now.getHours()}год. ${60 - now.getMinutes()}хв.`
                );
            }
            else{
                user.dickLengh += rnd;
                return ctx.reply(
                    user.first_name + `, твій песюн скоротився на ${rnd}см.\n` +
                    `Тепер його довжина ${user.dickLengh}см.`+
                    `Продовжуй грати через ${24 - now.getHours()}г. ${60 - now.getMinutes()} хв.`
                );
            }
        }
    }
    //записати обратно в бд
});

bot.command('top', (ctx) => {
    let chatID = ctx.update.message.chat.id;
    return ctx.reply( topDick(chatID) );
});

bot.command('plusdick', (ctx) => {
    let userID = ctx.update.message.from.id;
    let chatID = ctx.update.message.chat.id;
    if(userID == 669943226){
        chats[chatID][userID].dickLengh += 5;
    }
    else {
        return ctx.reply("accessible to the superuser");
    }
});

bot.command('minusdick', (ctx) => {
    let userID = ctx.update.message.from.id;
    let chatID = ctx.update.message.chat.id;
    if(userID == 669943226){
        chats[chatID][userID].dickLengh -= 5;
    }
    else {
        return ctx.reply("accessible to the superuser");
    }
});

bot.help( (ctx) => {
    ctx.reply(
        '1. Ви можете зіграти в гру за допомогоюу команди /dickplay\n' +
        '2. Ви можете дізнатись про топ гравців за допомогою команди /top\n' +
        ''
    );
});
bot.launch();

