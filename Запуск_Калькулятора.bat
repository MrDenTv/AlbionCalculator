@echo off
title Albion Calculator
echo Установка необходимых файлов (это нужно только при первом запуске)...
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
npm install
echo.
echo Запуск калькулятора...
npm start
pause
