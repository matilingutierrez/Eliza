import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const safeValidatorEnvSchema = z.object({
    SAFE_VALIDATOR_ADDRESS: z.string().min(1, "Safe validator address is required"),
    SAFE_VALIDATOR_PRIVATE_KEY: z.string().min(1, "Safe validator private key is required")
});

export type safeValidatorConfig = z.infer<typeof safeValidatorEnvSchema>;

export async function validateSafeValidatorConfig(
    runtime: IAgentRuntime
): Promise<safeValidatorConfig> {
    try {
        const config = {
            SAFE_VALIDATOR_ADDRESS:
                runtime.getSetting("SAFE_VALIDATOR_ADDRESS") ||
                process.env.SAFE_VALIDATOR_ADDRESS,
            SAFE_VALIDATOR_PRIVATE_KEY:
                runtime.getSetting("SAFE_VALIDATOR_PRIVATE_KEY") ||
                process.env.SAFE_VALIDATOR_PRIVATE_KEY
        };

        return safeValidatorEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `SafeValidator configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
