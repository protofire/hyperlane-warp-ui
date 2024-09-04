import { useState } from 'react';

import { IconButton } from '../../components/buttons/IconButton';
import { config } from '../../consts/config';
import XCircle from '../../images/icons/x-circle.svg';
import { Card } from '../layout/Card';

export function TipCard() {
  const [show, setShow] = useState(config.showTipBox);
  if (!show) return null;
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <h2 className="font-semibold text-black text-center sm:text-lg">Demo Bridge: Sepolia ⇄ Autonomys Nova Testnet</h2>
      <div className="flex flex-col items-center">
        <p className="text-center text-base sm:text-lg mb-2">Faucets:</p>
        <div className="flex justify-center space-x-4 text-xs sm:text-sm">
          <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noopener noreferrer" 
            className="flex items-center text-black underline hover:underline">
            <img src="/logos/eth.svg" alt="ETH" className="w-4 h-4 mr-1" />
            ETH Sepolia
          </a>
          <a href="https://sepolia.etherscan.io/address/0x7f11f79dea8ce904ed0249a23930f2e59b43a385#writeContract#F4" target="_blank" rel="noopener noreferrer" 
            className="flex items-center text-black underline hover:underline">
            <img src="/logos/usdt.svg" alt="USDT" className="w-4 h-4 mr-1" />
            USDT Sepolia
          </a>
          <a href="https://subspacefaucet.com/" target="_blank" rel="noopener noreferrer" 
            className="flex items-center text-black underline hover:underline">
            <img src="/logos/tatc.svg" alt="TATC" className="w-4 h-4 mr-1" />
            TATC
          </a>
        </div>
      </div>
      <div className="absolute right-3 top-3">
        <IconButton
          imgSrc={XCircle}
          onClick={() => setShow(false)}
          title="Hide tip"
          classes="hover:rotate-90"
        />
      </div>
    </Card>
  );
}