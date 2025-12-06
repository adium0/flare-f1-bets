import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { WalletState } from '@/types/betting';
import { COSTON2_CONFIG } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  isLoading: boolean;
}

const defaultWalletState: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  balance: '0',
  isCorrectNetwork: false,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(defaultWalletState);
  const [isLoading, setIsLoading] = useState(false);

  const updateWalletState = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        setWallet(defaultWalletState);
        return;
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdNumber = parseInt(chainId, 16);
      const isCorrectNetwork = chainIdNumber === COSTON2_CONFIG.chainId;

      let balance = '0';
      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        balance = (parseInt(balanceHex, 16) / 1e18).toFixed(4);
      } catch (e) {
        console.error('Failed to get balance:', e);
      }

      setWallet({
        isConnected: true,
        address: accounts[0],
        chainId: chainIdNumber,
        balance,
        isCorrectNetwork,
      });
    } catch (error) {
      console.error('Failed to update wallet state:', error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask Required',
        description: 'Please install MetaMask to connect your wallet.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWalletState();
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to your wallet.',
      });
    } catch (error: any) {
      console.error('Failed to connect:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [updateWalletState]);

  const disconnect = useCallback(() => {
    setWallet(defaultWalletState);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  }, []);

  const switchNetwork = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;

    setIsLoading(true);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${COSTON2_CONFIG.chainId.toString(16)}` }],
      });
      await updateWalletState();
    } catch (switchError: any) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${COSTON2_CONFIG.chainId.toString(16)}`,
                chainName: COSTON2_CONFIG.chainName,
                nativeCurrency: COSTON2_CONFIG.nativeCurrency,
                rpcUrls: [COSTON2_CONFIG.rpcUrl],
                blockExplorerUrls: [COSTON2_CONFIG.explorerUrl],
              },
            ],
          });
          await updateWalletState();
        } catch (addError) {
          console.error('Failed to add network:', addError);
          toast({
            title: 'Network Error',
            description: 'Failed to add Coston2 network.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Network Error',
          description: 'Failed to switch network.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [updateWalletState]);

  useEffect(() => {
    updateWalletState();

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', updateWalletState);
      window.ethereum.on('chainChanged', updateWalletState);

      return () => {
        window.ethereum.removeListener('accountsChanged', updateWalletState);
        window.ethereum.removeListener('chainChanged', updateWalletState);
      };
    }
  }, [updateWalletState]);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, switchNetwork, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
