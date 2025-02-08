import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { securityChecks } from './security-checks';

export const checkTxSecurity = (transaction: any): string => {
  let feedback = '';
  
  const results = securityChecks.map(check => check(transaction));
  
  results.forEach(result => {
    if (!result.secure) {
      feedback += result.feedback ? `${result.feedback}\n` : '';
    }
  });

  return feedback;
};

(async () => {
  const result = checkTxSecurity({
    to: '0x09750ad360fdb7a2ee23669c4503c974d86d8694',
  })
  console.log(result)
})()