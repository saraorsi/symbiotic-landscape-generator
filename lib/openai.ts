import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateSpeculation(input: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "I am an AI that speculates with a philosophical tone",
        },
        {
          role: "user",
          content: `Create a sentence of no more than 20 words that forms a speculative narrative that continues: ##${input}##".`,
        },
      ],
    });
    const data = await response.json();
    const specutation = data.choices[0].message.content;
    return specutation as string;
  } catch (error) {
    throw error;
  }
}

export async function generateLandscape(speculation: string) {
  let retries = 3;
  while (retries > 0) {
    try {
      const response = await openai.createImage({
        prompt: `Create an image that, without any text visible, visually represents ##${speculation}##.`,
        n: 1,
        size: "256x256",
      });

      const data = await response.json();
      const image_url = data.data[0].url;
      return image_url as string;
    } catch (error) {
      retries--;
      if (retries === 0) {
        throw error;
      }
    }
  }
}
