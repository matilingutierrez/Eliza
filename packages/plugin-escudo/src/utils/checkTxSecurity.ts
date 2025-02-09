import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { securityChecks } from './security-checks';

export const checkTxSecurity = (transaction: SafeMultisigTransactionResponse, owners: string[]): string => {
  let feedback = '';
  
  const results = securityChecks.map(check => check(transaction, owners));

  console.log('initial feedback', feedback)
  
  results.forEach(result => {
    if (!result.secure) {
      feedback += result.feedback ? `${result.feedback}\n` : '';
    }
  });

  console.log('final feedback', feedback)

  return feedback;
};