import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MagicAuthConnector } from '@web3-react/magic-auth'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import type { Connector } from '@web3-react/types'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { useEffect, useState } from 'react'

export function useGetName(connector: Connector | MagicAuthConnector) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (connector instanceof MetaMask) return 'MetaMask'
  if (connector instanceof WalletConnectV2) return 'WalletConnect'
  if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
  if (connector instanceof Network) return 'Network'
  if (connector instanceof GnosisSafe) return 'Gnosis Safe'
  if (connector instanceof MagicAuthConnector) {
    if (!mounted) return 'MagicAuth'
    const name = connector.getName()
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  return 'Unknown'
}
