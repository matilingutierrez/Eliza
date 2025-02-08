import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';

export const swapFrontrunningCheck = (
  transaction: SafeMultisigTransactionResponse,
) => {
  return {
    secure: true,
    feedback: '',
  };
};
