const config = {
    'oeth': {
        chainId: 10n,
        rpcUrl: 'https://optimism.llamarpc.com'
    },
    'eth': {
        chainId: 1n,
        rpcUrl: 'https://eth.llamarpc.com'
    },
    'arb1': {
        chainId: 42161n,
        rpcUrl: 'https://arbitrum.llamarpc.com'
    },
    'base': {
        chainId: 8453n,
        rpcUrl: 'https://base.llamarpc.com'
    },
    'matic': {
        chainId: 137n,
        rpcUrl: 'https://polygon.llamarpc.com'
    },
    'bsc': {
        chainId: 56n,
        rpcUrl: 'https://binance.llamarpc.com'
    },
    'gno': {
        chainId: 100n,
        rpcUrl: 'https://1rpc.io/gnosis'
    }
}

export const getConfig = (safeAddress: string): {address: string, chainId: bigint, rpcUrl: string} => {
    const safeAddressParts = safeAddress.split(':')
    const chain = safeAddressParts[0]
    const address = safeAddressParts[1]
    
    const {chainId, rpcUrl} = config[chain as keyof typeof config]
    return {address, chainId, rpcUrl}
}
