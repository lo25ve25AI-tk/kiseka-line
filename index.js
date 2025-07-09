
'use strict';

const express = require('express');
const line = require('@line/bot-sdk');

// LINE Botのチャネル設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// Expressアプリケーションのインスタンスを作成
const app = express();

// Webhook用のルーター
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// LINE Botのクライアントを作成
const client = new line.Client(config);

// イベントを処理する関数
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const receivedText = event.message.text;

  // 「キセカ」がメッセージに含まれているかチェック
  if (receivedText.includes('キセカ')) {
    // 元気な妹風の返信をランダムに選択
    const replies = [
      'お兄ちゃん、どうしたの！',
      'はーい、お兄ちゃん！キセカだよ！',
      'お兄ちゃん、呼んだ！',
      'なあに、お兄ちゃん！',
      'お兄ちゃん、だーいすき！'
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
    });
  } 

  // 「キセカ」が含まれていない場合は何もしない
  return Promise.resolve(null);
}

// サーバーを起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
