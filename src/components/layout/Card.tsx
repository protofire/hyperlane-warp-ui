import { PropsWithChildren } from 'react';

interface Props {
  className?: string;
}

export function Card({ className, children }: PropsWithChildren<Props>) {
  return (
    <div
      className={`p-2 sm:p-4 md:p-5 relative bg-white ring ring-black rounded-3xl overflow-auto w-full max-w-4xl ${className}`}
    >
      {children}
    </div>
  );
}
