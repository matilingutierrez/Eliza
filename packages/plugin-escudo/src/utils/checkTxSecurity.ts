import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { securityChecks } from './security-checks';

export const checkTxSecurity = (transaction: SafeMultisigTransactionResponse): string => {
  let feedback = '';
  
  const results = securityChecks.map(check => check(transaction));
  
  results.forEach(result => {
    if (!result.secure) {
      feedback += result.feedback ? `${result.feedback}\n` : '';
    }
  });

  return feedback;
};