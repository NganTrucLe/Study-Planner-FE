import { GoogleGenerativeAI } from "@google/generative-ai";

import { Session } from "@/lib/types/session.type";
import { Subject } from "@/lib/types/subject.type";
import { Task } from "@/lib/types/task.type";

const GEMINI_KEY = "AIzaSyCMbdCr-ufd775DtoWA6glKXKk5N5uozt0";
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function askGemini(
  tasks: Pick<Task, "_id" | "name" | "startDate" | "endDate" | "status">[]
) {
  const prompt = `
  You are a helpful assistant. Below is a list of schedules in this week in GMT+7 Vietnam time, providing feedback and insights. Feedback should include warnings about tight schedules and prioritization recommendations for balance and focus. The feedback mustn't too long and should write in markdown format. List of schedules:
    ${JSON.stringify(tasks, null, 2)}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function askGeminiForFeedback({
  tasks,
  subjects,
  sessions,
}: {
  tasks: Task[];
  subjects: Subject[];
  sessions: Session[];
}) {
  const prompt = `
  You are a helpful assistant. Below is a list of tasks, subjects, and focus sessions. Provide feedback and insights on the user's performance. Feedback should identify areas where the user is excelling, suggest subjects or tasks that may need more attention, offer motivational feedback to encourage consistency and improvement. Keep the feedback concise and write it in markdown format. List of tasks, subjects and focus sessions:
    ${JSON.stringify(tasks, null, 2)}, ${JSON.stringify(subjects, null, 2)}, ${JSON.stringify(sessions, null, 2)}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
