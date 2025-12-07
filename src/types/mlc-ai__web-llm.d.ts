declare module "@mlc-ai/web-llm" {
  export class ChatWorkerClient {
    static create(args: { model: string; modelId: string; runtime?: string }): Promise<ChatWorkerClient>;
    chat: {
      completions: {
        create: (input: {
          messages: { role: "user" | "assistant"; content: string }[];
        }) => Promise<{
          choices: { message: { content: string } }[];
        }>;
      };
    };
  }
}