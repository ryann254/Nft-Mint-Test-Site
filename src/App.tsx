import { ReactElement, useEffect, useState } from 'react';

import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = (): ReactElement => {
	const [currentAccount, setcurrentAccount] = useState('');

	const checkIfWalletIsConnected = async (): Promise<void> => {
		//@ts-ignore
		const { ethereum } = window;

		if (!ethereum) {
			alert('Make sure you have metamask!');
		} else {
			console.log('We have the ethereum object', ethereum);
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account: ', account);
			setcurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
	};

	const connectWallet = async () => {
		try {
			//@ts-ignore
			const { ethereum } = window;

			if (!ethereum) {
				alert('Get Metamask!');
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			});

			console.log('Connected', accounts[0]);
			setcurrentAccount(accounts[0]);
		} catch (error) {
			console.log('Error: ', error);
		}
	};

	// Render Methods
	const renderNotConnectedContainer = () => (
		<button
			onClick={connectWallet}
			className='cta-button connect-wallet-button'
		>
			Connect to Wallet
		</button>
	);

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
		<div className='App'>
			<div className='container'>
				<div className='header-container'>
					<p className='header gradient-text'>My NFT Collection</p>
					<p className='sub-text'>
						Each unique. Each beautiful. Discover your NFT today.
					</p>
					{currentAccount === '' ? (
						renderNotConnectedContainer()
					) : (
						<button
							onClick={() => {}}
							className='cta-button connect-wallet-button'
						>
							Mint NFT
						</button>
					)}
				</div>
				<div className='footer-container'>
					<img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
					<a
						className='footer-text'
						href={TWITTER_LINK}
						target='_blank'
						rel='noreferrer'
					>{`built on @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
