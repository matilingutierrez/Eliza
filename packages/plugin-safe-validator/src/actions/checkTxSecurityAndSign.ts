import type { Action, IAgentRuntime, Memory, State, HandlerCallback } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
import { validateSafeValidatorConfig } from "../environment";
import { createSafeValidatorService } from "../services";
import { getCheckTxSecurityAndSignExamples } from "../examples";
import type { CheckTxSecurityAndSignResponse } from "../types";
import { getConfig } from "../utils/config";

export const getCheckTxSecurityAndSignAction = (): Action => {
    return {
        name: "CHECK_TX_SECURITY_AND_SIGN",
        similes: ["VERIFY_AND_SIGN_TX", "SECURE_TX_SIGN", "VALIDATE_AND_SIGN_TX"],
        description: "Check transaction security and sign if secure",
        validate: async (runtime: IAgentRuntime) => {
            await validateSafeValidatorConfig(runtime);
            return true;
        },
        handler: async (
            runtime: IAgentRuntime,
            message: Memory,
            _state: State,
            _options: Record<string, unknown>,
            callback: HandlerCallback
        ) => {
            try {
                // Validate config
                const config = await validateSafeValidatorConfig(runtime);

                // Get transaction from message content
                const {address, chainId, rpcUrl} = getConfig(message.content.text.split('`')[1] as string);

                if (!address) {
                    callback({
                        text: "No address provided to check transactions and sign",
                        content: { error: "Missing address" }
                    });
                    return false;
                }

                // Initialize service and check/sign tx
                const safeValidatorService = createSafeValidatorService(rpcUrl, config.SAFE_VALIDATOR_PRIVATE_KEY, config.SAFE_VALIDATOR_ADDRESS, address, chainId);
                const result: CheckTxSecurityAndSignResponse = await safeValidatorService.checkTxSecurityAndSign();

                const callbackContent = {
                    secure: result.secure,
                    signed: result.signed,
                    feedback: result.feedback
                };

                callback({
                    text: result.feedback,
                    content: callbackContent
                });
                return result.secure;

            } catch (error) {
                elizaLogger.error("Transaction security check failed:", error);
                callback({
                    text: `❌ Failed to check/sign transaction: ${error.message || error}`,
                    content: { error: error.message || String(error) }
                });
                return false;
            }
        },
        examples: getCheckTxSecurityAndSignExamples,
    };
};
