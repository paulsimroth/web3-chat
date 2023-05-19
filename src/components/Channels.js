const Channels = ({ provider, account, web3chat, channels, currentChannel, setCurrentChannel }) => {

  const channelHandler = async (channel) => {
    const hasJoined = await web3chat.hasJoined(channel.id, account);

    if (hasJoined) {
      setCurrentChannel(channel);
    } else {
      const signer = await provider.getSigner();
      const tx = await web3chat.connect(signer).mint(channel.id, { value: channel.cost });
      await tx.wait();
    };
  };

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>
        <ul>
          {channels.map((channel, index) => (
            <li
              key={index}
              onClick={() => channelHandler(channel)}
              className={currentChannel && currentChannel.id.toString() === channel.id.toString() ? "active" : ""}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;