import { WideChevronIcon } from '@hyperlane-xyz/widgets';
import { Card } from '../../components/layout/Card';
import { Color } from '../../styles/Color';
import { TransferTokenForm } from './TransferTokenForm';

export function TransferTokenCard() {
  return (
    <Card className="w-full">
      <>
        <div className="absolute hidden left-0 right-0 -top-20 sm:-top-28 md:-top-36 sm:flex justify-center overflow-hidden z-10">
          <WideChevron
            direction="s"
            height="100%"
            width="100"
            rounded={true}
            color={Color.black}
          />
        </div>
        <TransferTokenForm />
      </>
    </Card>
  );
}

function WideChevron({
  direction,
  height,
  width,
  rounded,
  color,
}: {
  direction: 'n' | 'e' | 's' | 'w';
  height?: string;
  width?: string;
  rounded?: boolean;
  color?: string;
}) {
  return (
    <WideChevronIcon
      width={width}
      height={height}
      direction={direction}
      color={color}
      rounded={rounded}
    />
  );
}
