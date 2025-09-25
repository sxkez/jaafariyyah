// Lightweight placeholder for the OpenAI SDK so the app can compile even if the
// official package is not installed. Replace this implementation with the
// official client when the dependency and API key are available.

interface OpenAIClientOptions {
  apiKey?: string;
  dangerouslyAllowBrowser?: boolean;
}

class PlaceholderOpenAIClient {
  constructor(public readonly options: OpenAIClientOptions) {}

  chat = {
    completions: {
      create: async (): Promise<never> => {
        throw new Error(
          "OpenAI client is not configured. Install the 'openai' package and provide an API key to enable this feature."
        );
      },
    },
  };
}

export const openai = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  ? new PlaceholderOpenAIClient({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  : null;
