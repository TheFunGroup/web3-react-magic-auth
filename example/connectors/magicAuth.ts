import { initializeConnector } from '@web3-react/core'
import { MagicAuthConnector } from '@web3-react/magic-auth'

export const [MagicConnector, MagicHooks] = initializeConnector<MagicAuthConnector>(
  (actions) =>
    new MagicAuthConnector({
      actions,
      options: {
        magicAuthApiKey: 'pk_live_846F1095F0E1303C',
        supportedAuthProviders: ['google', 'twitter', 'apple', 'discord'],
        redirectURI: 'http://localhost:3000/',
        networkOptions: {
          rpcUrl: 'https://rpc-mainnet.maticvigil.com',
          chainId: 137,
        },
      },
    })
)
