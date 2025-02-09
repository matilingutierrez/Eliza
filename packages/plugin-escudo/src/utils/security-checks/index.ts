import { SafeMultisigTransactionResponse } from '@safe-global/types-kit';
import { addressPoisoningCheck } from './address-poisoning';
import { darklistedAddressCheck } from './darklisted-address';
import { swapFrontrunningCheck } from './swap-frontunning';
import { unsafeApprovalCheck } from './unsafe-approval';

// Type for security check functions
type SecurityCheck = (transaction: SafeMultisigTransactionResponse, owners: string[]) => {
  secure: boolean;
  feedback: string;
};

// Export array of security check functions
export const securityChecks: SecurityCheck[] = [
  addressPoisoningCheck,
  darklistedAddressCheck,
  swapFrontrunningCheck,
  unsafeApprovalCheck,
];
