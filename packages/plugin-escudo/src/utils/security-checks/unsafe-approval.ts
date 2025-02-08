import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';

export const unsafeApprovalCheck = (
  transaction: SafeMultisigTransactionResponse,
) => {
  return {
    secure: true,
    feedback: '',
  };
};
