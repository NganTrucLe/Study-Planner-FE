import { Task } from "@/lib/types/task.type";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.VITE_GEMINI_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function askGemini(
  tasks: Pick<Task, "_id" | "name" | "startDate" | "endDate" | "status">[]
) {
  const prompt = `
  You are a helpful assistant. Below is a list of schedules in this week, providing feedback and insights. Feedback should include warnings about tight schedules and prioritization recommendations for balance and focus. The feedback mustn't too long and should write in markdown format. List of schedules:
    ${JSON.stringify(tasks, null, 2)}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
