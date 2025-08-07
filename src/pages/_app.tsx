import { QueryClient } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import 'src/vendor/inpage-metamask';
import 'src/vendor/polyfill';

import '@hyperlane-xyz/widgets/styles.css';

import '../styles/fonts.css';
import '../styles/globals.css';
import { useIsSsr } from '../utils/ssr';

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  // Disable app SSR for now as it's not needed and
  // complicates graphql integration
  const isSsr = useIsSsr();
  if (isSsr) {
    return <div></div>;
  }

  return (
    // <ErrorBoundary>
    //   <QueryClientProvider client={reactQueryClient}>
    //     <WarpContext>
    //       <EvmWalletContext>
    //         <SolanaWalletContext>
    //           <CosmosWalletContext>
    //             <AppLayout>
    //               <Component {...pageProps} />
    //               <Analytics />
    //             </AppLayout>
    //             <ToastContainer
    //               transition={Zoom}
    //               position={toast.POSITION.BOTTOM_RIGHT}
    //               limit={2}
    //             />
    //           </CosmosWalletContext>
    //         </SolanaWalletContext>
    //       </EvmWalletContext>
    //     </WarpContext>
    //   </QueryClientProvider>
    // </ErrorBoundary>

    <>
      <div className="h-screen bg-gradient-to-br from-[#1a2341] via-[#2b376b] to-[#b3c6f7] rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
        <p className="text-[#e3e8f7] text-lg mb-4 text-center">
          <span className="font-semibold">Will be available soon!</span>
        </p>
      </div>
    </>
  );
}