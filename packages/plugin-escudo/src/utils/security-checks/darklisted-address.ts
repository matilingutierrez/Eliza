import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { addressDarkList } from './data/addresses-darklist';

export const darklistedAddressCheck = (
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

    for (const addressEntry of addresses) {
        const darklistedAddress = addressDarkList.find(
            darklist => darklist.address.toLowerCase() === addressEntry.address.toLowerCase()
        )

        if (darklistedAddress) {
            return {
                secure: false,
                feedback: `${addressEntry.action} involving malicious address ${addressEntry.address} which is darklisted. ${darklistedAddress.comment}`,
            };
        }
    }

    return {
        secure: true,
        feedback: '',
    };
};