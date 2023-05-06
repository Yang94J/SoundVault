import '@/styles/globals.css'

import {
  BSC,
  Ethereum,
  EthereumGoerli,
  BSCTestnet,
} from '@particle-network/common';
import { evmWallets, solanaWallets } from '@particle-network/connect';
import { ModalProvider } from '@particle-network/connect-react-ui';
import { WalletEntryPosition } from '@particle-network/auth';
import '@particle-network/connect-react-ui/esm/index.css';
import PNApi from '@/config/apikey/PNapi';

export default function App({ Component, pageProps }) {
  return (
    <ModalProvider
            walletSort={['Particle Auth', 'Wallet']}
            particleAuthSort={[
                'email',
                'phone',
                'google',
                'apple',
                'facebook',
                'microsoft',
                'linkedin',
                'github',
                'discord',
            ]}
            options={{
                projectId: PNApi.projectId,
                clientKey: PNApi.clientKey,
                appId: PNApi.appId,
                chains: [
                    // PlatON,
                    // Optimism,
                    // Moonbeam,
                    // Moonriver,
                    // Avalanche,
                    // Polygon,
                    // BSC,
                    // Ethereum,
                    EthereumGoerli,
                    // Solana,
                    // BSCTestnet,
                    // KCCTestnet,
                ],
                particleWalletEntry: {
                    displayWalletEntry: true,
                    defaultWalletEntryPosition: WalletEntryPosition.BR,
                    supportChains: [Ethereum, EthereumGoerli],
                },
                wallets: [...evmWallets({ qrcode: false }), ...solanaWallets()],
            }}
            language="en"
            theme={'light'}
        >
            <Component {...pageProps} />
        </ModalProvider>
        // <Component {...pageProps} />
    );
}
