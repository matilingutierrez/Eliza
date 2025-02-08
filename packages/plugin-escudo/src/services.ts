import { CheckTxSecurityAndSignResponse } from "./types";
import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { maxUint256 } from "viem";

import { createRequire } from 'module';
import { checkTxSecurity } from "./utils/checkTxSecurity";
const require = createRequire(import.meta.url);
const SafeApiKit = require('@safe-global/api-kit').default;
const Safe = require('@safe-global/protocol-kit').default;

export const createEscudoService = (
    rpcUrl: string,
    privateKey: string,
    safeAddress: string
) => {
    const checkTxSecurityAndSign = async (
        address: string
    ): Promise<CheckTxSecurityAndSignResponse> => {
        try {
            const apiKit = new SafeApiKit({
                chainId: 10n
            })

            const protocolKitAgent = await Safe.init({
                provider: rpcUrl,
                signer: privateKey,
                safeAddress: safeAddress
              })
            const pendingTransactions: SafeMultisigTransactionResponse[] = (await apiKit.getPendingTransactions(safeAddress)).results.filter(tx => tx.isExecuted === false).reverse()
            console.log(pendingTransactions)

            if (pendingTransactions.length > 0) {
                let securityFeedbackMessage = ''
                let signedTransactions = 0
                let rejectedTransactions = 0
                let executionErrors = ''

                for (const transaction of pendingTransactions) {
                    const securityFeedback = checkTxSecurity(transaction)

                    if (securityFeedback) {
                        securityFeedbackMessage += `\n- Transaction ${transaction.nonce}: ${securityFeedback}`
                        rejectedTransactions++
                        continue
                    }

                    try {
                        const safeTxHash = transaction.safeTxHash
                        const signature = await protocolKitAgent.signHash(safeTxHash)

                        console.log(transaction.dataDecoded)
                        console.log(transaction.to)
                        console.log(transaction.value)
                        console.log(maxUint256)
                    
                        // Confirm the Safe transaction
                        await apiKit.confirmTransaction(
                            safeTxHash,
                            signature.data
                        )

                        const safeTransaction = await apiKit.getTransaction(safeTxHash)
                        await protocolKitAgent.executeTransaction(safeTransaction)

                        signedTransactions++
                    } catch (error) {
                        executionErrors += `\nTransaction ${transaction.nonce} failed: ${error.message}`
                        rejectedTransactions++
                    }
                }

                let feedback = ''
                
                if (signedTransactions > 0) {
                    feedback += `Successfully signed and executed ${signedTransactions} transaction${signedTransactions > 1 ? 's' : ''}.`
                }
                
                if (rejectedTransactions > 0) {
                    if (feedback) feedback += '\n'
                    feedback += `${rejectedTransactions} transaction${rejectedTransactions > 1 ? 's were' : ' was'} rejected.`
                    if (securityFeedbackMessage) {
                        feedback += `\n### Security issues\n${securityFeedbackMessage}`
                    }
                    if (executionErrors) {
                        feedback += `\n### Execution errors\n${executionErrors}`
                    }
                }

                return {
                    signed: signedTransactions > 0,
                    secure: rejectedTransactions === 0,
                    feedback
                };
            } else {
                return {
                    signed: false,
                    secure: true,
                    feedback: "There are no pending transactions",
                };
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        checkTxSecurityAndSign,
    };
};