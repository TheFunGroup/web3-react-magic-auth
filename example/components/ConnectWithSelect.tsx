import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import type { Web3ReactHooks } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MagicAuthConnector } from '@web3-react/magic-auth'
import type { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { useCallback, useEffect, useState } from 'react'

import { CHAINS } from '../chains'

function ChainSelect({
  activeChainId,
  switchChain,
  chainIds,
}: {
  activeChainId: number
  switchChain: (chainId: number) => void
  chainIds: number[]
}) {
  return (
    <select
      value={activeChainId}
      onChange={(event) => {
        switchChain(Number(event.target.value))
      }}
      disabled={switchChain === undefined}
    >
      <option hidden disabled selected={activeChainId === undefined}>
        Select chain
      </option>
      <option value={-1} selected={activeChainId === -1}>
        Default
      </option>
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId} selected={chainId === activeChainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  )
}

export function ConnectWithSelect({
  connector,
  activeChainId,
  chainIds = Object.keys(CHAINS).map(Number),
  isActivating,
  isActive,
  error,
  setError,
  activate,
}: {
  connector: MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network | GnosisSafe | MagicAuthConnector
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[]
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error: Error | undefined) => void
  activate: () => void
}) {
  const [desiredChainId, setDesiredChainId] = useState<number>(undefined)

  /**
   * When user connects eagerly (`desiredChainId` is undefined) or to the default chain (`desiredChainId` is -1),
   * update the `desiredChainId` value so that <select /> has the right selection.
   */
  useEffect(() => {
    if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
      setDesiredChainId(activeChainId)
    }
  }, [desiredChainId, activeChainId])

  const switchChain = useCallback(
    async (desiredChainId: number) => {
      setDesiredChainId(desiredChainId)

      try {
        if (
          // If we're already connected to the desired chain, return
          desiredChainId === activeChainId ||
          // If they want to connect to the default chain and we're already connected, return
          (desiredChainId === -1 && activeChainId !== undefined)
        ) {
          setError(undefined)
          return
        }

        if (desiredChainId === -1 || connector instanceof GnosisSafe) {
          await activate()
        } else if (
          connector instanceof WalletConnectV2 ||
          connector instanceof WalletConnect ||
          connector instanceof Network
        ) {
          await activate()
        } else {
          await activate()
        }

        setError(undefined)
      } catch (error) {
        setError(error)
      }
    },
    [connector, activeChainId, setError]
  )

  if (connector instanceof MagicAuthConnector)
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ChainSelect activeChainId={desiredChainId} switchChain={switchChain} chainIds={chainIds} />
        <div style={{ marginBottom: '1rem' }} />
        {isActive ? (
          error ? (
            <button onClick={() => switchChain(desiredChainId)}>Try again?</button>
          ) : (
            <button
              onClick={() => {
                if (connector?.deactivate) {
                  void connector.deactivate()
                } else {
                  void connector.resetState()
                }
                setDesiredChainId(undefined)
              }}
            >
              Disconnect
            </button>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {connector.getSupportedAuthProviders().map((oAuthProvider, index) => (
              <button
                style={{ margin: '4px 0' }}
                key={index}
                onClick={() => connector.activate({ oAuthProvider })}
                disabled={isActivating}
              >
                {error ? `Try ${oAuthProvider} again` : `Connect with ${oAuthProvider}`}
              </button>
            ))}
          </div>
        )}
      </div>
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {!(connector instanceof GnosisSafe) && (
        <ChainSelect activeChainId={desiredChainId} switchChain={switchChain} chainIds={chainIds} />
      )}
      <div style={{ marginBottom: '1rem' }} />
      {isActive ? (
        error ? (
          <button onClick={() => switchChain(desiredChainId)}>Try again?</button>
        ) : (
          <button
            onClick={() => {
              if (connector?.deactivate) {
                void connector.deactivate()
              } else {
                void connector.resetState()
              }
              setDesiredChainId(undefined)
            }}
          >
            Disconnect
          </button>
        )
      ) : (
        <button
          onClick={() =>
            connector instanceof GnosisSafe
              ? void connector
                  .activate()
                  .then(() => setError(undefined))
                  .catch(setError)
              : switchChain(desiredChainId)
          }
          disabled={isActivating || !desiredChainId}
        >
          {error ? 'Try again?' : 'Connect'}
        </button>
      )}
    </div>
  )
}
