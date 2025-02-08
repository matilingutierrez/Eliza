import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { addressDarkList } from './addresses-darklist';

export const darklistedAddressCheck = (
  transaction: any,
) => {

    const address = transaction.to
    const darklistedAddress = addressDarkList.find(darklist => darklist.address === address)

    if (darklistedAddress) {
        return {
            secure: false,
            feedback: `The address ${address} is darklisted. ${darklistedAddress.comment}`,
        };
    } else {
        return {
            secure: true,
            feedback: '',
        };
    }
};

console.log(darklistedAddressCheck({
    to: '0x09750ad360fdb7a2ee23669c4503c974d86d8694',
}))