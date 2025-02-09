import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';

export const swapFrontrunningCheck = (
  transaction: SafeMultisigTransactionResponse,
  owners: string[]
) => {
    let secure = true;
    let feedback = '';
    transaction.dataDecoded.parameters.forEach(parameter => {
        if (parameter.name === 'amountOutMin' && parameter.value === '0') {
            secure = false;
            feedback = 'Unsafe zero amount out min. This transaction can be victim of a [frontrunning](https://cow.fi/learn/what-is-frontrunning) or [sandwich attack](https://www.coinbase.com/en-ar/learn/crypto-glossary/what-are-sandwich-attacks-in-crypto)';
        }
    })

  return {
    secure,
    feedback,
  };
};
