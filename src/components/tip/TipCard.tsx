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
      <h2 className="font-semibold text-black text-center sm:text-lg">Auto EVM Bridge</h2>
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