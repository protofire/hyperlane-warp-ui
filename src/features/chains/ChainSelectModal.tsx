import { Modal, XIcon } from '@hyperlane-xyz/widgets';
import { ChainLogo } from '../../components/icons/ChainLogo';
import { useStore } from '../store';
import { useWarpCore } from '../tokens/hooks';
import { useMultiProvider } from './hooks';
import { getChainDisplayName } from './utils';

export function ChainSelectListModal({
  isOpen,
  close,
  onSelect,
}: {
  isOpen: boolean;
  close: () => void;
  onSelect: (chain: ChainName) => void;
}) {
  const { chainMetadata } = useStore((s) => ({
    chainMetadata: s.chainMetadata,
  }));
  const multiProvider = useMultiProvider();
  const warpCore = useWarpCore();

  const onSelectChain = (chainName: ChainName) => {
    onSelect(chainName);
    close();
  };

  // Get chains that have tokens configured in warpRoutes
  const allowedChains = new Set(warpCore.tokens.map((t) => t.chainName));
  const chains = Object.values(chainMetadata).filter((chain) =>
    allowedChains.has(chain.name),
  );

  return (
    <Modal isOpen={isOpen} close={close} panelClassname="p-0 max-w-md rounded-3xl overflow-hidden">
      <div className="bg-white">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-200">
          <h2 className="text-center text-lg font-semibold text-gray-900">Select Chain</h2>
          <button
            onClick={close}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <XIcon width={20} height={20} />
          </button>
        </div>

        {/* Chain List */}
        <div className="py-3">
          {chains.map((chain) => {
            const displayName = getChainDisplayName(multiProvider, chain.name, true);
            return (
              <button
                key={chain.name}
                onClick={() => onSelectChain(chain.name)}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <ChainLogo chainName={chain.name} size={28} />
                <span className="text-base text-gray-900 truncate" title={displayName}>
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
