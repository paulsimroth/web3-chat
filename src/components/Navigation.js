import { ethers } from 'ethers'
import { connect } from 'socket.io-client';

const Navigation = ({ account, setAccount }) => {

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>Web3Chat</h1>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(39, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          CONNECT
        </button>
      )}
    </nav>
  );
}

export default Navigation;