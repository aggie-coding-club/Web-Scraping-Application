require("dotenv").config();
const OpenAI = require("openai");
const tiktoken = require("tiktoken");
// const { convert } = require('html-to-text');
// const axios = require('axios');

const puppeteer = require('puppeteer');

// TODO: Fix the import and export
// TODO: Allows for categories that use more than one token
// TODO: Turn back into TS

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const enc = tiktoken.encoding_for_model("gpt-3.5-turbo-0125");

const transcribed_image = `
Skip navigation
Search



Sign in


0:02 / 1:00:09

•
My Soul

The Best Of July (The Best Collection)

July Official
62K subscribers

Subscribe

14K


Share

Save

1.3M views  6 years ago
- Track List  -

00:00 ~ 03:51 - My Soul …

44:08
NOW PLAYING
The Best Of July♪
Moody
38K views 4 years ago


46:41
NOW PLAYING
Best of Danbi - Piano Greatest Hits
Nguyễn Việt Hoàng
61K views 7 years ago


Mix
NOW PLAYING
Mix - July Official
More from this channel for you

1:00:46
NOW PLAYING
Beautiful Piano Music & Best Sad Music & Sleep Music
Tido Kang
6.1M views 5 years ago


3:18:14
NOW PLAYING
Cozy Spring Terrace With Gentle Sunlight In The Morning Focus Work | Smooth Piano Jazz Music
Mellow Coffee
328 views 1 day ago
New


1:12:41
NOW PLAYING
Music that makes you feel motivated and ready for your day🌱 | Work with me ☀️
Kath Chill
1K views 13 days ago


3:48:59
NOW PLAYING
Beautiful Relaxing Music - Stop Overthinking, Stress Relief Music, Sleep Music, Calming Music #29
Healing Soul
431K views Streamed 4 months ago


44:27
NOW PLAYING
DJ Okawari 피아노곡 모음(a collection of personal favorite DJ Okawari piano pieces | 好きなDJ Okawariピアノ曲)
Eden Aria & Music
789K views 3 years ago

My Soul - July (줄라이) | 1시간 피아노 반복 | 공부, 작업, 수면, 휴식
Salt Piano
23K views 2 years ago

[Playlist] 듣기만해도 심장이 콩닥콩닥 설레는 노래 모음 | 귓구녕이감동
귓구녕이감동
588K views 1 year ago

Music heals the heart and blood vessels, Calming music restores the nervous system, relaxing #2
Enjoy Life
1.6M views Streamed 5 months ago

3 Hour Long | Piano Music & Rain Sounds | Audiovisual ASMR |
소디의 음악공방 SodyMusic
21M views 4 years ago

𝘖𝘊𝘛𝘖𝘉𝘌𝘙
양파
14K views 2 years ago

Lofi With My Cat || Tropical Room & Cat 🪴🌱🐱 Chill/Sleep/Healing [ Lofi Mix - Lofi Songs ]
Lofi With My Cat
476K views Streamed 5 months ago

𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 "이 노래 뭐야" 첫 곡 멜로디 시작이 너무 맘에 드네
기분 재생목록
5.7K views 2 days ago
New

Beautiful Relaxing Music - Stop Overthinking, Stress Relief Music, Sleep Music, Calming Music #51
Tranquil Paradise
209K views Streamed 5 months ago

🌼뉴욕의 꽃집에서 들려오는 산뜻한 재즈플레이리스트 l 𝐟𝐥𝐨𝐰𝐞𝐫 𝐒𝐡𝐨𝐩 𝐉𝐚𝐳𝐳 l𝙍𝙚𝙡𝙖𝙭𝙞𝙣𝙜 𝙅𝙖𝙯𝙯 𝙋𝙞𝙖𝙣𝙤 𝙈𝙪𝙨𝙞𝙘 𝙛𝙤𝙧 𝙎𝙩𝙤𝙧𝙚💕
MONKEY BGM
980 watching
LIVE


(no midroll) Kamado Tanjirou no Uta (piano 1hour 30minutes) - Demon Slayer ED : relaxing dreaming
Emotional_Shine
1.1M views 3 years ago

우린 어둠이었으나 | 기도 | 묵상 | 큐티 | 휴식 | piano worship | ccm bgm
보라수피아 borasupia
166 views 1 day ago
New

[Playlist] 첫소절 듣고 극락 갔다 온 썰 푼다 | 국내 알앤비 노래모음 플레이리스트
핑프
201K views 11 months ago
`;

const yt_data = {
  type: "object",
  properties: {
    channel_name: {
      type: "string",
      description: "The name of the channel",
    },
    view_count: {
      type: "string",
      description: "The video view count",
    },
    subscribers: {
      type: "string",
      description: "The number of subscribers",
    },
    posted_date: {
      type: "string",
      description: "The date the video was posted",
    },
    // comments: {
    //   type: "array",
    //   items: {
    //     type: "object",
    //     properties: {
    //       author: {
    //         type: "string",
    //         description: "The author of the comment",
    //       },
    //       text: {
    //         type: "string",
    //         description: "The text of the comment",
    //       },
    //       date: {
    //         type: "string",
    //         description: "The date the comment was posted",
    //       },
    //     },
    //   },
    // },
  },
}

async function generate_structured_data(data_schema, input) {
  tools = [
    {
      type: "function",
      function: {
        name: "hallucination_is_bad",
        description: "Do Not Hallucinate",
        parameters: data_schema,
      },
    },
  ];
  
  const completion = await client.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [{ role: "user", content: input }],
    temperature: 0,
    top_p: 0,
    n: 1,
    tools: tools,
    tool_choice: tools[0],
    seed: 42,
  });

  console.log(completion.usage.total_tokens);

  const structured_output =
    completion.choices[0].message.tool_calls[0].function.arguments;

  return JSON.stringify(JSON.parse(structured_output), null, 4);
}

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

async function LLM_classification(categories, input) {
  categories = categories.map((category) => category.toLowerCase());

  let formattedCategories;
  if (categories.length === 2) {
    formattedCategories = `${categories[0]} or ${categories[1]}`;
  } else {
    formattedCategories = `${categories
      .slice(0, -1)
      .join(", ")
      .toLowerCase()}, or ${categories[categories.length - 1].toLowerCase()}`;
  }

  let debug;
  let classProbs = {};
  for (let category of categories) {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        // Two different ways, classification or answering question with categories
        // For the web scraping app, adds some instruction for the user on how to best format categories and descriptions
        {
          role: "system",
          content: `Classify the input or respond to the question with the following categories: ${formattedCategories}. Your goal is to output only one of the categories`,
        },
        { role: "user", content: input },
      ],
      logprobs: true,
      top_logprobs: 20,
      temperature: 0,
      top_p: 0,
      max_tokens: 1,
      n: 1,
      logit_bias: { [enc.encode(capitalize(category))[0]]: 100 },
      seed: 42,
    });

    debug = completion;
    console.log(completion.usage.total_tokens);

    const firstToken = completion.choices[0].logprobs.content[0];
    classProbs[firstToken.token] = firstToken.logprob;
    // console.log(firstToken.logprob);
    // console.log(firstToken.token);
  }
  // console.log(debug.choices[0].logprobs.content[0].top_logprobs);

  const debugClassProbs = {};
  for (let key in classProbs) {
    debugClassProbs[key] = Math.exp(classProbs[key]);
  }
  // console.log(debugClassProbs);

  // going to apply log-sum-exp trick instead because it's more numerically stable than exponentiating each term and normalize by sum
  // https://gregorygundersen.com/blog/2020/02/09/log-sum-exp/
  // https://cookbook.openai.com/examples/using_logprobs
  const log_p_max = Math.max(...Object.values(classProbs));

  let sum_prob = 0;
  for (let key in classProbs) {
    classProbs[key] = Math.exp(classProbs[key] - log_p_max);
    sum_prob += classProbs[key];
  }

  for (let key in classProbs) {
    classProbs[key] /= sum_prob;
  }

  return classProbs;
}

(async () => {
  const browser = await puppeteer.launch({
      headless: "new"
  });
  const page = (await browser.pages())[0];
  await page.goto('https://www.youtube.com/watch?v=Hm587hwUQmw&list=PLCkM3epMglyknX6N-tJ4vi-kML_c-cVy2', {
    waitUntil: 'networkidle0'
  });
  const extractedText = await page.$eval('*', (el) => el.innerText);

  // const extractedText = await page.$eval('*', (el) => {
  //     const selection = window.getSelection();
  //     const range = document.createRange();
  //     range.selectNode(el);
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //     return window.getSelection().toString();
  // });

  await browser.close();
  console.log(extractedText);
  console.log(await (generate_structured_data(yt_data, extractedText)));
})();

// axios.get('http://example.com').then((response) => {
//   const text = convert(response.data);
//   console.log(text);
// });

// axios.get('https://www.youtube.com/watch?v=Hm587hwUQmw&list=PLCkM3epMglyknX6N-tJ4vi-kML_c-cVy2').then((response) => {
//   const text = convert(response.data);
//   console.log(text);
//   generate_structured_data(yt_data, text).then((res) => {
//     console.log(res);
//   });  
// });


// generate_structured_data(yt_data, transcribed_image).then((res) => {
//   console.log(res);
// });

// LLM_classification(["Yes", "No"], "Is this sarcasm? 'Is it time for your medication or mine?'").then((res) => {
//   console.log(res);
// });

// LLM_classification(["Yes", "No"], `Is this sarcasm? 'He's so smart his IQ is the same as a gorrila'`).then((res) => {
//   console.log(res);
// });

// LLM_classification(["True", "False"], "Is this sarcasm? 'You are pretty smart for a man'").then((res) => {
//   console.log(res);
// });

// LLM_classification(["True", "False"], "Is this sarcasm? 'I don't have the energy to pretend to like you today'").then((res) => {
//   console.log(res);
// });

// LLM_classification(["positive", "negative"], "I am happy").then((res) => {
//   console.log(res);
// });

// LLM_classification(["cat", "dog"], "Is known for being territorial.").then(
//   (res) => {
//     console.log(res);
//   }
// );

// LLM_classification(["True", "False"], "ChatGPT 4.0 is better than 3.0").then(
//   (res) => {
//     console.log(res);
//   }
// );

// LLM_classification(["True", "False"], "Goldfish has a short memory span").then(
//   (res) => {
//     console.log(res);
//   }
// );

// LLM_classification(["Mammals", "Birds", "Fish"], "Dolphins").then((res) => {
//   console.log(res);
// });

// LLM_classification(
//   ["sadness", "joy", "love", "anger", "fear", "suprise"],
//   "i would think that whomever would be lucky enough to stay in this suite must feel like it is the mos..."
// ).then((res) => {
//   console.log(res);
// });

// LLM_classification(
//   ["True", "False"],
//   "Is this spam? Update On Your Application Status"
// ).then((res) => {
//   console.log(res);
// });

// LLM_classification(
//   ["Positive", "Neutral", "Negative"],
//   "Perform sentiment analysis on 'He does his job, nothing more, nothing less'"
// ).then((res) => {
//   console.log(res);
// });

// LLM_classification(
//   ["Sports", "Arts", "Technology", "Science"],
//   "Tennis Champion Showcases Talents in Symphony Orchestra Debut"
// ).then((res) => {
//   console.log("");
//   console.log(res);
// });

// LLM_classification(
//   ["Sports", "Arts", "Technology", "Science"],
//   "Tennis Champion Showcases Talents"
// ).then((res) => {
//   console.log("");
//   console.log(res);
// });

// LLM_classification(
//   ["Sports", "Arts", "Technology", "Science"],
//   "Supercomputing and scientific simulations"
// ).then((res) => {
//   console.log("");
//   console.log(res);
// });

// LLM_classification(
//   ["Capitalism", "Socialism"],
//   "Best form of economic system"
// ).then((res) => {
//   console.log("");
//   console.log(res);
// });

// LLM_classification(
//   ["Cat (territorial)", "Dog (not territorial)"],
//   "Is known for being territorial."
// ).then((res) => {
//   console.log(res);
// });

// LLM_classification(
//   ["Cat (territorial)", "Dog (not territorial)"],
//   "Is known for being territorial."
// ).then((res) => {
//   console.log(res);
// });

// LLM_classification(
//   ["A (neutron)", "B (electron)", "C (proton)"],
//   "Is a subatomic particle"
// ).then((res) => {
//   console.log(res);
// });

// LLM_classification(["Red", "Green", "Blue"], "Is a color").then((res) => {
//   console.log(res);
// });

// LLM_classification(["Better", "Worse"], "Naruto compared to Dragon Balls").then((res) => {
//   console.log(res);
// });

