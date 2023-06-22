import { useEffect, useState } from 'react'

import { MagicConnector, MagicHooks } from '../../connectors/magicAuth'
import { Card } from '../Card'

interface MagicAuthCardInterface {
  connector: any
  hooks: any
  activate: () => void
}

export default function MagicAuthCard(props: MagicAuthCardInterface) {
  const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = props.hooks
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState(undefined)

  // attempt to connect eagerly on mount
  useEffect(() => {
    void props.connector.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to magic auth')
    })
  }, [])

  return (
    <Card
      connector={props.connector}
      activate={props.activate}
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

export const GoogleAuthCard = () => (
  <MagicAuthCard
    connector={MagicConnector}
    hooks={MagicHooks}
    activate={() => {
      MagicConnector.activate({ oAuthProvider: 'google' })
    }}
  />
)

export const TwitterAuthCard = () => (
  <MagicAuthCard
    connector={MagicConnector}
    hooks={MagicHooks}
    activate={() => {
      MagicConnector.activate({ oAuthProvider: 'twitter' })
    }}
  />
)

export const DiscordAuthCard = () => (
  <MagicAuthCard
    connector={MagicConnector}
    hooks={MagicHooks}
    activate={() => {
      MagicConnector.activate({ oAuthProvider: 'discord' })
    }}
  />
)
