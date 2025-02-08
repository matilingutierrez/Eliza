import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';

export const addressPoisoningCheck = (
  transaction: SafeMultisigTransactionResponse,
) => {
  return {
    secure: true,
    feedback: '',
  };
};
