import TelegramBot from 'node-telegram-bot-api';
import process from 'process';

const token = process.env.BOT_TOKEN || '8329670043:AAG8U3VRsJKwDAOVGbuRIXKTgye8Uf_g4bA';
const webAppUrl = process.env.WEB_APP_URL || 'https://fitnes-trener-24.surge.sh';

const bot = new TelegramBot(token, { polling: true });

console.log('⚡ Telegram бот "Фитнес Тренер" успешно запущен!');
console.log(`🔗 Рабочая HTTPS ссылка на WebApp: ${webAppUrl}`);

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || 'Атлет';

  try {
    await bot.sendMessage(
      chatId,
      `Привет, ${firstName}! 👋\n\nДобро пожаловать в **Фитнес Тренер**! 🏋️‍♂️\n\nНажмите на кнопку ниже, чтобы запустить приложение:\n\n*(Если попросит подтверждение IP - просто нажмите синюю кнопку "Click to Continue" на экране).*`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть Фитнес Тренер',
                web_app: { url: webAppUrl }
              }
            ]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
  }
});

bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    bot.sendMessage(
      msg.chat.id,
      'Нажмите на кнопку "🚀 Открыть Фитнес Тренер", чтобы запустить приложение!',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть Фитнес Тренер',
                web_app: { url: webAppUrl }
              }
            ]
          ]
        }
      }
    );
  }
});
