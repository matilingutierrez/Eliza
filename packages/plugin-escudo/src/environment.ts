import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const escudoEnvSchema = z.object({
    AGENT_ADDRESS: z.string().min(1, "Agent address is required"),
    AGENT_PRIVATE_KEY: z.string().min(1, "Agent private key is required")
});

export type escudoConfig = z.infer<typeof escudoEnvSchema>;

export async function validateEscudoConfig(
    runtime: IAgentRuntime
): Promise<escudoConfig> {
    try {
        const config = {
            AGENT_ADDRESS:
                runtime.getSetting("AGENT_ADDRESS") ||
                process.env.AGENT_ADDRESS,
            AGENT_PRIVATE_KEY:
                runtime.getSetting("AGENT_PRIVATE_KEY") ||
                process.env.AGENT_PRIVATE_KEY
        };

        return escudoEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Escudo configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
