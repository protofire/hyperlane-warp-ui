import type { NextPage } from 'next';
import { FloatingButtonStrip } from '../components/nav/FloatingButtonStrip';
import { TipCard } from '../components/tip/TipCard';
import { TransferTokenCard } from '../features/transfer/TransferTokenCard';

const Home: NextPage = () => {
  return (
    <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
      <TipCard />
      <div className="relative">
        <TransferTokenCard />
        <FloatingButtonStrip />
      </div>
    </div>
  );
};

export default Home;
