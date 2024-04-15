import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { http, createConfig, useConnect } from "wagmi";
import { bsc } from "wagmi/chains";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
const connector = getWagmiConnectorV2();

const config = createConfig({
  ssr: true,
  chains: [bsc],
  connectors: [connector()],
  transports: {
    [bsc.id]: http(),
  },
});

const inter = Inter({ subsets: ["latin"] });

function App() {
  const { connectors, connectAsync } = useConnect();

  const connectBtns = connectors.map((connector) => (
    <button
      key={connector.id}
      onClick={async () => {
        try {
          await connectAsync({ connector });
        } catch (e) {
          console.error(e);
        }
      }}
      className={styles["line-item"]}
    >
      Connect via {connector.name}
    </button>
  ));

  return (
    <>
      <Head>
        <title>Binance W3W Usage Example</title>
        <meta name="description" content="Binance web3 wallet usage example" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.center}>
          <div className={styles.lines}>{connectBtns}</div>
        </div>
      </main>
    </>
  );
}

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
