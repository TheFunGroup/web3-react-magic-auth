import { useEffect, useState } from 'react'

import { MagicConnector, MagicHooks } from '../../connectors/magicAuth'
import { MagicAuthCard } from '../MagicAuthCard'



export default function MagicOAuthComponent() {
  const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = MagicHooks
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState(undefined)

  // attempt to connect eagerly on mount
  useEffect(() => {
    void MagicConnector.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to magic auth')
    })
  }, [])

  return (
    <MagicAuthCard
      connector={MagicConnector}
      activeChainId={chainId}
      isActivating={isActivating}
      isActive={isActive}
      error={error}
      setError={setError}
      accounts={accounts}
      provider={provider}
      ENSNames={ENSNames}
    />
  )
}

