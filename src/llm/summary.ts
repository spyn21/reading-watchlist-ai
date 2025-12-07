export async function summarize(text: string): Promise<string> {
  let waited = 0;

  // ⏳ Wait until window.loadLLM is defined (max 5 seconds)
  while (typeof (window as any).loadLLM !== "function") {
    if (waited > 5000) throw new Error("LLM not initialized in time");
    await new Promise((r) => setTimeout(r, 100));
    waited += 100;
  }

  const llm = await (window as any).loadLLM();
  const reply = await llm.chat.completions.create({
    messages: [{ role: "user", content: `Summarize: ${text}` }],
  });

  return reply.choices[0].message.content;
}