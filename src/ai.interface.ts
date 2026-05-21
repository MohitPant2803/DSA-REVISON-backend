export interface AIProvider {
  generateText?(prompt: string, options?: any): Promise<string>;
  // Add any other shared methods your OpenAI and Gemini providers need to implement
}