import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const moduleTypeSchema = z.enum(["tool", "resource", "prompt"]);

export const registerableModuleSchema = z.object({
  type: moduleTypeSchema,
  name: z.string(),
  description: z.string().optional(),
  register: z.function()
    .args(z.any(), z.any().optional())
    .returns(z.union([z.void(), z.promise(z.void())]))
});

export type RegisterableModule<TDeps = unknown> = {
  type: z.infer<typeof moduleTypeSchema>;
  name: string;
  description?: string;
  register: (server: McpServer, deps?: TDeps) => void | Promise<void>;
};

export function isRegisterableModule(module: unknown): module is RegisterableModule {
  const result = registerableModuleSchema.safeParse(module);
  return result.success;
}