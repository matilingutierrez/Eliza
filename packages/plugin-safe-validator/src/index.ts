export * from "./types";

import type { Plugin } from "@elizaos/core";
import { getCheckTxSecurityAndSignAction } from "./actions/checkTxSecurityAndSign";

export const safeValidatorPlugin: Plugin = {
    name: "safe-validator",
    description: "Safe  security checker and signer",
    providers: [],
    evaluators: [],
    services: [],
    actions: [getCheckTxSecurityAndSignAction()],
};

export default safeValidatorPlugin;
