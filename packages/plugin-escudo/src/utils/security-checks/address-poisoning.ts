import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';

export const addressPoisoningCheck = (
  transaction: SafeMultisigTransactionResponse,
  owners: string[]
) => {
    const addresses = [{
        action: 'transfer',
        address: transaction.to
    }]

    const { dataDecoded } = transaction
    if (dataDecoded) {
        if (['approve', 'transfer'].includes(dataDecoded.method)) {
            addresses.push({
                action: `ERC-20 ${dataDecoded.method}`,
                address: dataDecoded.parameters[0].value
            })
        }
    }

    const trustedAddresses = [transaction.safe, ...owners];

    for (const addressEntry of addresses) {
        for (const trustedAddress of trustedAddresses) {
            const potentialMalicious = addressEntry.address.toLowerCase();
            const trusted = trustedAddress.toLowerCase();
            
            if (potentialMalicious !== trusted && 
                potentialMalicious.slice(0,4) === trusted.slice(0,4) && 
                potentialMalicious.slice(-2) === trusted.slice(-2)) {
                return {
                    secure: false,
                    feedback: `${addressEntry.action} involving potential address poisoning attack. Address \`${addressEntry.address}\` looks similar to trusted address \`${trustedAddress}\` but it's not`,
                };
            }
        }
    }

    return {
        secure: true,
        feedback: '',
    };
};
