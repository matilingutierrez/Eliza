import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { maxUint256 } from 'viem';

export const unsafeApprovalCheck = (
  transaction: SafeMultisigTransactionResponse,
) => {
    const { dataDecoded } = transaction
    if (dataDecoded) {
        if (dataDecoded.method === 'approve') {
            const amount = dataDecoded.parameters[1].value
            if (amount === maxUint256.toString()) {
                return {
                    secure: false,
                    feedback: `Infinite approval of ${transaction.to} token to ${dataDecoded.parameters[0].value}, consider approving a lower amount`,
                };
            }
        }
    }
    return {
        secure: true,
        feedback: '',
    };
};
