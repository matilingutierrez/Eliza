import { ActionExample } from "@elizaos/core";

export const getCheckTxSecurityAndSignExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you check and sign this Safe transaction? It's a transfer of 1 ETH to 0x123...789",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll analyze the transaction for any security concerns and sign it if everything looks safe.",
                action: "CHECK_TX_SECURITY_AND_SIGN",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I've reviewed the transaction and everything appears secure. The transaction is a standard ETH transfer with reasonable gas parameters. I've signed it as a multisig signer.",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Please review and sign this Safe transaction to interact with contract 0xabc...def",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll analyze the security of this transaction.",
                action: "CHECK_TX_SECURITY_AND_SIGN",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I cannot sign this transaction due to security concerns. The target contract (0xabc...def) has been flagged for suspicious activity and appears on multiple scam lists. Additionally, the transaction includes unusually high gas fees that could drain the safe's funds. I recommend canceling this transaction.",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you check and sign this token approval transaction in our Safe?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll review the token approval transaction for security issues.",
                action: "CHECK_TX_SECURITY_AND_SIGN",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I've declined to sign this transaction. The approval amount is set to unlimited (2^256 - 1), which is a security risk. I recommend setting a specific approval amount that matches your intended transaction instead of an unlimited approval.",
            },
        },
    ]
]