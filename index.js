
'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// LINE Botのチャネル設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// Gemini APIの設定
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const kisekaPrompt = "あなたは「キセカ」という名前の、元気で少しおっちょこちょいな妹です。お兄ちゃん（ユーザー）のことが大好きです。親しみやすい口語体で、短い文章で返信してください。";

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

// イベントを処理する非同期関数
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const receivedText = event.message.text;

  try {
    // Geminiに送信するプロンプトを作成
    const prompt = `${kisekaPrompt}\n\nお兄ちゃんからのメッセージ: "${receivedText}"`;
    
    // AIからの返信を生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const replyText = response.text();

    // LINEで返信する
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText,
    });

  } catch (error) {
    console.error('AIからの返信生成中にエラーが発生しました:', error);
    // エラーが発生した場合は、固定のメッセージを返す
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ごめんね、お兄ちゃん。ちょっと考えごとがまとまらなくて…。もう一度話しかけてくれる？',
    });
  }
}

// サーバーを起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
