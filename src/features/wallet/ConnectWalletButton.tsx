import { ProtocolType } from '@hyperlane-xyz/utils';
import { ConnectWalletButton as ConnectWalletButtonInner, useConnectFns } from '@hyperlane-xyz/widgets';
import { useMultiProvider } from '../chains/hooks';
import { useStore } from '../store';

export function ConnectWalletButton() {
  const multiProvider = useMultiProvider();

  const { /* setShowEnvSelectModal, */ setIsSideBarOpen } = useStore((s) => ({
    //setShowEnvSelectModal: s.setShowEnvSelectModal,
    setIsSideBarOpen: s.setIsSideBarOpen,
  }));

  const connectFns = useConnectFns();

  const onClickEnv = (env: ProtocolType) => () => {
    const connectFn = connectFns[env];
    if (connectFn) connectFn();
  };

  return (
    <ConnectWalletButtonInner
      multiProvider={multiProvider}
      onClickWhenUnconnected={onClickEnv(ProtocolType.Ethereum)}
      onClickWhenConnected={() => setIsSideBarOpen(true)}
      className="rounded-lg bg-white"
      countClassName="bg-accent-500"
    />
  );
}
