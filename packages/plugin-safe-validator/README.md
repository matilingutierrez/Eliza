# @elizaos/plugin-safe-validator

This plugin provides comprehensive multisig transaction validation and signing capabilities through integration with Safe's SDK.

## Description

The Safe Transactions Validator plugin enables secure multisig transaction validation, proposal, and signing with built-in security checks and Safe protocol integration.

## Features

- Safe SDK integration for transaction management
- Comprehensive security validation suite
- MultiSend transaction support
- Transaction proposal and signing
- Automated security analysis
- Custom security check framework
- Transaction parameter verification
- Owner validation
- Value transfer validation
- Contract interaction analysis

## Security Checks

The following security checks are performed on each transaction:

| Check | Description | Severity |
|-------|-------------|----------|
| Address Poisoning | Detects addresses that look similar to trusted addresses but are malicious | Critical |
| Swap Frontrunning | Identifies unsafe swap parameters that could lead to frontrunning attacks | High |
| Darklisted Address | Validates addresses against known malicious/scam addresses | Critical |
| Unsafe Approval | Detects infinite token approvals and suggests safer amounts | High |

## Configuration

### Required Environment Variables

```env
# Safe Transactions Validator Plugin Configuration
AGENT_ADDRESS=                              # Address of the agent
AGENT_PRIVATE_KEY=                          # Private key of the agent
```

## Actions

### CHECK_TX_SECURITY_AND_SIGN

Validates transaction security and signs if secure. This action performs comprehensive security checks on a transaction before signing. If the transaction is flagged as insecure, it will create and sign a rejection transaction instead.

**Aliases:**
- VERIFY_AND_SIGN_TX
- SECURE_TX_SIGN 
- VALIDATE_AND_SIGN_TX

**Returns:**
- `secure`: Boolean indicating if transaction passed security checks
- `signed`: Boolean indicating if transaction was signed
- `feedback`: Detailed feedback about security analysis and signing result

## Contributing

To add a new security check to the plugin, follow these steps:

1. Create a new security check function in `utils/security-checks/`:
   - Implement the check function following the security check interface
   - Add comprehensive tests for the new check

2. Include the check in `utils/checkTxSecurity.ts`:
   - Import the new check function
   - Add it to the array of security checks
   - Update the security check results aggregation if needed

3. Document the new security check in this README:
   - Add an entry to the Security Checks table above
   - Include the check name, description and severity level
   - Document any specific configuration requirements

The new security check should follow the existing patterns and maintain high code quality standards. Make sure to thoroughly test the check with various transaction scenarios before submitting a PR.

## Credits
This project was made for [Safe Agentathon](https://safe.global/ai). The main package used for this development was the [Safe{Core} SDK](https://docs.safe.global/sdk/overview)

## License

This plugin is part of the Eliza project. See the main project repository for license information.