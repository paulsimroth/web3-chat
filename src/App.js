import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { io } from "socket.io-client";

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Web3chat from './abis/Web3chat.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [web3chat, setWeb3chat] = useState(null);

  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);

  const loadChainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const web3chat = new ethers.Contract(config[network.chainId].Web3chat.address, Web3chat, provider);
    setWeb3chat(web3chat);

    const totalChannels = await web3chat.totalChannels();
    const channels = [];

    for (let i = 0; i <= totalChannels; i++) {
      const channel = await web3chat.getChannel(i);
      channels.push(channel);
    };

    setChannels(channels);

    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    });
  };

  useEffect(() => {
    loadChainData();

    socket.on("connect", () => {
      socket.emit("get messages")
    });

    socket.on("new message", (messages) => {
      setMessages(messages);
    });

    socket.on("get messages", (messages) => {
      setMessages(messages);
    });

    return () => {
      socket.off("connect");
      socket.off("new message");
      socket.off("get messages");
    };

  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <main>

        <Servers />

        <Channels
          provider={provider}
          account={account}
          web3chat={web3chat}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />

        <Messages account={account} messages={messages} currentChannel={currentChannel} />

      </main>
    </div>
  );
}

export default App;
