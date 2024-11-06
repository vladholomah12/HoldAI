"use client"

import { useEffect, useState } from 'react'
import { tonConnector } from '@/lib/ton-connect'
import { Button } from '../ui/button'

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = tonConnector.onStatusChange(wallet => {
      setIsConnected(!!wallet)
      if (wallet) {
        setAddress(wallet.account.address)
        console.log('Connected wallet:', wallet.account.address)
      } else {
        setAddress(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      if (isConnected) {
        await tonConnector.disconnect()
      } else {
        await tonConnector.connect()
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
      </Button>
      {address && (
        <p className="text-sm text-gray-500 text-center break-all">
          {`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
      )}
    </div>
  )
}