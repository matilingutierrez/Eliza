
export * from "./types";

import type { Plugin } from "@elizaos/core";
import { getCheckTxSecurityAndSignAction } from "./actions/checkTxSecurityAndSign";

export const escudoPlugin: Plugin = {
    name: "escudo",
    description: "Safe txs security checker and signer",
    providers: [],
    evaluators: [],
    services: [],
    actions: [getCheckTxSecurityAndSignAction()],
};

export default escudoPlugin;
