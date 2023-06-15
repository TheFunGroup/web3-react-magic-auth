import { useEffect, useState } from 'react'

import {
  discordConnector,
  discordHooks,
  googleConnector,
  googleHooks,
  twitterConnector,
  twitterHooks,
} from '../../connectors/magicAuth'
import { Card } from '../Card'

interface MagicAuthCardInterface {
  connector: any
  hooks: any
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

export const GoogleAuthCard = () => <MagicAuthCard connector={googleConnector} hooks={googleHooks} />

export const TwitterAuthCard = () => <MagicAuthCard connector={twitterConnector} hooks={twitterHooks} />

export const DiscordAuthCard = () => <MagicAuthCard connector={discordConnector} hooks={discordHooks} />
