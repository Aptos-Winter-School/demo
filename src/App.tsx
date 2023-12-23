import React, { useEffect, useState } from "react";
import './App.css';

function App() {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined);
  const [network, setNetwork] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchStatus() {
      const isAlreadyConnected = await window.aptos.isConnected();
      setIsConnected(isAlreadyConnected);
      if (isAlreadyConnected) {
        const [activeAccount, activeNetworkName] = await Promise.all([
          window.aptos.account(),
          window.aptos.network(),
        ]);
        setAddress(activeAccount.address);
        setPublicKey(activeAccount.publicKey);
        setNetwork(activeNetworkName);
      } else {
        setAddress(undefined);
        setPublicKey(undefined);
        setNetwork(undefined);
      }
    }

    window.aptos.onAccountChange(async (account: any) => {
      if (account.address) {
        setIsConnected(true);
        setAddress(account.address);
        setPublicKey(account.publicKey);
        setNetwork(await window.aptos.network());
      } else {
        setIsConnected(false);
        setAddress(undefined);
        setPublicKey(undefined);
        setNetwork(undefined);
      }
    });

    window.aptos.onNetworkChange((params: any) => {
      setNetwork(params.networkName);
    });

    window.aptos.onDisconnect(() => {
      console.log("Disconnected");
    });

    fetchStatus();

  }, []);

  const onConnectClick = async () => {
    if (isConnected) {
      await window.aptos.disconnect();
      setIsConnected(false);
      setAddress(undefined);
      setPublicKey(undefined);
      setNetwork(undefined);
    } else {
      const activeAccount = await window.aptos.connect();
      const activeNetworkName = await window.aptos.network();
      setIsConnected(true);
      setAddress(activeAccount.address);
      setPublicKey(activeAccount.publicKey);
      setNetwork(activeNetworkName);
    }
  };

  const burnNFT = () => {
    alert("NFTs burned!");
  }

  const onBurnNFTClick = async () => {
    setTimeout(burnNFT, 2000);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Burn NFT</h1>
      </header>
      <p>
        {isConnected ? `Address: ${address}` : "Not Connected"}
      </p>
      <p>
        {`Network: ${network}`}
      </p>

      <h3 style={{ fontSize: "12px" }}>Connect the wallet, and burn entire NFT collection!</h3>

      <button className="Button" type="button" style={{ margin: "5px" }}
        onClick={onConnectClick}>{isConnected ? "Disconnect" : "Connect"}</button>
      <br />
      <button className="Button" type="button" style={{ margin: "5px" }}
        onClick={onBurnNFTClick}>Burn NFT</button>
      {/* <button className="Button" type="button"
        onClick={onSubmitTransactionClick}>{txnText}</button> */}
    </div>
  );
}

export default App;
