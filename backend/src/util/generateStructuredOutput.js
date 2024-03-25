require("dotenv").config();
const OpenAI = require("openai");
const tiktoken = require("tiktoken");

// TODO: Fix the import and export
// TODO: Allows for categories that use more than one token
// TODO: Turn back into TS

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const enc = tiktoken.encoding_for_model("gpt-3.5-turbo-0125");

const transcribed_image = `
Exil - Hiboky

Romain Spiteri
Subscribe
31K subscribers

10M views 5 years ago
It's my first song in this channel. I hope you will love it
You can stream this song on : ...more

351K

Share Download ...

Next: 2 Hour Beautiful Piano Music for Studying an...
Instrumental Music Full Final List - 3 / 316

All Melodies Soundtracks Beats Ani

Discover how an education at
Texas A&M RELLIS can help y...
Texas A&M-RELLIS
54K views
Sponsored

[slowed+reverb] Exil - Hiboky (1
hour)
aesthetic nightcore
45K views 3 years ago

Shorts remixing this video

8,591 Comments = Sort by

Add a comment...

@hornyhippo 4 years ago
1:07 is probably what ur looking for
10K
Reply
     161 replies

@vantablack8258 3 years ago (edited)
"This is the story you started, Eren."

-Armin
4K
Reply
     40 replies

@naija9031 1 year ago (edited)
"People's lives don't end when they die, it ends when they lose faith."

Type here to search
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
    comments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          author: {
            type: "string",
            description: "The author of the comment",
          },
          text: {
            type: "string",
            description: "The text of the comment",
          },
          date: {
            type: "string",
            description: "The date the comment was posted",
          },
        },
        required: ["author", "text", "date"],
      },
    },
  },
  required: [
    "channel_name",
    "view_count",
    "subscribers",
    "comments",
    "posted_date",
  ],
}

async function generate_structured_data(data_schema, input) {
  tools = [
    {
      type: "function",
      function: {
        name: "generate_structured_ouput",
        description: "Generate structured output from unstructured data",
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

generate_structured_data(yt_data, transcribed_image).then((res) => {
  console.log(res);
});

LLM_classification(["Yes", "No"], "Is this sarcasm? 'Is it time for your medication or mine?'").then((res) => {
  console.log(res);
});

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
