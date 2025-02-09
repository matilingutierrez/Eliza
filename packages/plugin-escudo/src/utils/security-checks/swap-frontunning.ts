import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';

export const swapFrontrunningCheck = (
  transaction: SafeMultisigTransactionResponse,
  owners: string[]
) => {
  return {
    secure: true,
    feedback: '',
  };
};
