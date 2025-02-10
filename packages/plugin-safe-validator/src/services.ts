import { CheckTxSecurityAndSignResponse } from "./types";
import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { erc20Abi, maxUint256 } from "viem";

import { createRequire } from 'module';
import { checkTxSecurity } from "./utils/checkTxSecurity";
const require = createRequire(import.meta.url);
const SafeApiKit = require('@safe-global/api-kit').default;
const Safe = require('@safe-global/protocol-kit').default;

export const createSafeValidatorService = (
    rpcUrl: string,
    privateKey: string,
    agentAddress: string,
    safeAddress: string,
    chainId: bigint
) => {
    const checkTxSecurityAndSign = async (): Promise<CheckTxSecurityAndSignResponse> => {
        try {
            const apiKit = new SafeApiKit({
                chainId
            })

            const protocolKitAgent = await Safe.init({
                provider: rpcUrl,
                signer: privateKey,
                safeAddress: safeAddress
              })
            const pendingTransactions: SafeMultisigTransactionResponse[] = (await apiKit.getPendingTransactions(safeAddress)).results.filter(tx => tx.isExecuted === false).reverse()

            if (pendingTransactions.length > 0) {
                const safeInfo = await apiKit.getSafeInfo(pendingTransactions[0].safe)
                const owners = safeInfo.owners

                let securityFeedbackMessage = ''
                let signedTransactions = 0
                let rejectedTransactions = 0
                let executionErrors = ''

                for (const transaction of pendingTransactions) {
                    let securityFeedback = ''
                    if (transaction.dataDecoded?.method === 'multiSend') {
                        (transaction.dataDecoded?.parameters[0] as any).valueDecoded?.forEach((tx, index) => {
                            const txSecurityFeedback = checkTxSecurity({...tx, safe: transaction.safe}, owners)
                            if (txSecurityFeedback) {
                                securityFeedback += `\n  - **Multisend operation ${index + 1}**: ${txSecurityFeedback}`
                            }
                        })
                    } else {
                        securityFeedback = checkTxSecurity(transaction, owners)
                    }

                    if (securityFeedback) {
                        securityFeedbackMessage += `\n- Transaction ${transaction.nonce}: ${securityFeedback}`
                        rejectedTransactions++
                        const rejectionTransaction = await protocolKitAgent.createRejectionTransaction(transaction.nonce)
                        const safeTxHash = await protocolKitAgent.getTransactionHash(rejectionTransaction)
                        const signature = await protocolKitAgent.signHash(safeTxHash)
                        await apiKit.proposeTransaction({
                            safeAddress: safeAddress,
                            safeTransactionData: rejectionTransaction.data,
                            safeTxHash,
                            senderAddress: agentAddress,
                            senderSignature: signature.data
                          })
                        continue
                    }

                    try {
                        const safeTxHash = transaction.safeTxHash
                        const signature = await protocolKitAgent.signHash(safeTxHash)
    
                        // Confirm the Safe transaction
                        await apiKit.confirmTransaction(
                            safeTxHash,
                            signature.data
                        )
                        
                        if (rejectedTransactions === 0) {
                            const safeTransaction = await apiKit.getTransaction(safeTxHash)
                            await protocolKitAgent.executeTransaction(safeTransaction)
                        }

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