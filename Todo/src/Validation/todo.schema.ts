import { z } from "zod"

// Zod schema -> Runtime validation(checking incoming data when the app runs)
export const todoValidationSchema = z.object({
  id: z.string().describe("Id of the Todo"),
  title: z.string().describe("Title of the todo"),
  description: z.string().optional().describe("description of todo"),
  isComplete: z.boolean().default(false).describe("Todo is completed or not")
})

// TypeScript type inferred from the schema (compile-time)(TypeScript type safety while coding)
export type Todo = z.infer<typeof todoValidationSchema>