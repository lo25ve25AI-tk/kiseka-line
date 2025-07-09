'use strict';

const line = require('@line/bot-sdk');

// LINE Botのチャネル設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// LINE Botのクライアントを作成
const client = new line.Client(config);

// メッセージを送信するターゲットのユーザーID
const targetUserId = process.env.TARGET_LINE_USER_ID; // 環境変数から取得

// キセカからの起床メッセージ
const morningMessage = {
  type: 'text',
  text: 'お兄ちゃん、おはよう！今日も一日がんばろうねっ♪',
};

// メッセージを送信する関数
async function sendMorningMessage() {
  if (!targetUserId) {
    console.error('TARGET_LINE_USER_ID が設定されていません。');
    return;
  }

  try {
    await client.pushMessage(targetUserId, morningMessage);
    console.log('起床メッセージを送信しました。');
  } catch (error) {
    console.error('起床メッセージの送信中にエラーが発生しました:', error);
  }
}

// スクリプト実行
sendMorningMessage();
