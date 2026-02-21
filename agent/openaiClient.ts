import "dotenv/config";
import OpenAI from "openai";

/**
 * OpenAI client instance configured with the API key from environment variables.
 */
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});