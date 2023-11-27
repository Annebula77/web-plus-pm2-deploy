# Деплой приложения на сервер с использованием pm2

Стартеркит проекта по автоматизации деплоя фронтенда и бэкенда при помощи pm2 (pm2 deploy)

# Если приложение frontend не запускается на более поздних версиях Node.js, то

## Для Unix/Linux/Mac:

    bash

NODE_OPTIONS=--openssl-legacy-provider npm start

Для Windows (в командной строке):

cmd

set NODE_OPTIONS=--openssl-legacy-provider
npm start

Или в PowerShell:

ps

\$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
