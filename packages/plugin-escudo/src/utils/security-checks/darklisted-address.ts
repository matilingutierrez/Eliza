import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { addressDarkList } from './data/addresses-darklist';

export const darklistedAddressCheck = (
  transaction: SafeMultisigTransactionResponse,
) => {

    const address = transaction.to
    const darklistedAddress = addressDarkList.find(darklist => darklist.address.toLowerCase() === address.toLowerCase())

    if (darklistedAddress) {
        return {
            secure: false,
            feedback: `Transfer to malicious address ${address} which is darklisted. ${darklistedAddress.comment}`,
        };
    } else {
        return {
            secure: true,
            feedback: '',
        };
    }
};