import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Contract, Signer } from 'ethers';
import { BET_MANAGER_ABI, CONTRACT_ADDRESS } from '@/config/contract';
import { useWallet } from '@/context/WalletContext';

export interface ContractState {
  provider: BrowserProvider | null;
  signer: Signer | null;
  contract: Contract | null;
  isReady: boolean;
}

export function useContract() {
  const { wallet } = useWallet();
  const [state, setState] = useState<ContractState>({
    provider: null,
    signer: null,
    contract: null,
    isReady: false,
  });

  useEffect(() => {
    const initContract = async () => {
      if (!wallet.isConnected || !wallet.isCorrectNetwork || typeof window.ethereum === 'undefined') {
        setState({ provider: null, signer: null, contract: null, isReady: false });
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, BET_MANAGER_ABI, signer);

        setState({ provider, signer, contract, isReady: true });
        console.log('Contract initialized:', CONTRACT_ADDRESS);
      } catch (error) {
        console.error('Failed to initialize contract:', error);
        setState({ provider: null, signer: null, contract: null, isReady: false });
      }
    };

    initContract();
  }, [wallet.isConnected, wallet.isCorrectNetwork]);

  return state;
}

// Hook for read-only contract access (doesn't need wallet)
export function useReadOnlyContract() {
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('https://coston2-api.flare.network/ext/C/rpc');
        const contract = new Contract(CONTRACT_ADDRESS, BET_MANAGER_ABI, provider);
        setContract(contract);
      } catch (error) {
        console.error('Failed to initialize read-only contract:', error);
      }
    };
    init();
  }, []);

  return contract;
}
