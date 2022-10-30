import { ReactElement, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import nftMintingSiteTest2 from './utils/NftMintingSiteTest2.json';

// Constants
const TWITTER_HANDLE = 'ronjozkeddely';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK =
	'https://testnets.opensea.io/collection/squarenft-qip4pymiv6';
// const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = '0x4db8CF4DB16BfD873524F2e5D6512DDaE15fcBb5';

const App = (): ReactElement => {
	const [currentAccount, setcurrentAccount] = useState('');
	const [mintingNFT, seTmintingNFT] = useState(false);
	const [mintInfo, setMintInfo] = useState('');

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
			setupEventListener();
		} else {
			console.log('No authorized account found');
		}

		let chainId = await ethereum.request({ method: 'eth_chainId' });
		console.log('Connected to chain ' + chainId);

		const goerliChainId = '0x5';
		if (chainId !== goerliChainId) {
			alert("My boy, you're not connected to the Goerli Test Network");
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
			setupEventListener();
		} catch (error) {
			console.log('Error: ', error);
		}
	};

	const setupEventListener = async () => {
		try {
			//@ts-ignore
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					nftMintingSiteTest2.abi,
					signer
				);

				connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
					console.log(from, tokenId.toNumber());
					setMintInfo(
						`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
					);
				});

				console.log('Setup event listener');
			} else {
				console.log("Ethereum object doesn't exist");
			}
		} catch (error) {
			console.log('Error: ', error);
		}
	};

	const askContractToMintNft = async () => {
		try {
			seTmintingNFT(true);
			//@ts-ignore
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					nftMintingSiteTest2.abi,
					signer
				);

				console.log('Going to pop wallet now to pay gas...');
				let nftTxn = await connectedContract.makeAnEpicNFT();

				console.log('Mining....please wait.');
				await nftTxn.wait();

				console.log(
					`Minded, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
				);
				seTmintingNFT(false);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			seTmintingNFT(false);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='App'>
			<div className='container'>
				<div className='header-container'>
					<p className='header gradient-text'>My NFT Collection</p>
					<p className='sub-text'>
						Each unique. Each beautiful. Discover your NFT today.
					</p>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '500px',
							margin: '0 auto',
						}}
					>
						{currentAccount === '' ? (
							renderNotConnectedContainer()
						) : (
							<button
								onClick={askContractToMintNft}
								className='cta-button connect-wallet-button'
								disabled={mintingNFT}
							>
								{mintingNFT ? 'Loading...' : 'Mint NFT'}
							</button>
						)}
						{mintInfo !== '' ? (
							<h3 style={{ marginTop: '15px', fontWeight: 'bold' }}>
								{mintInfo}
							</h3>
						) : null}
						<button
							style={{ marginTop: '25px' }}
							className='cta-button connect-wallet-button'
						>
							<a
								className='footer-text'
								style={{ textDecoration: 'none' }}
								href={OPENSEA_LINK}
								target='_blank'
								rel='noreferrer'
							>
								View Collection On Opensea
							</a>
						</button>
					</div>
				</div>
				<div className='footer-container'>
					<img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
					<a
						className='footer-text'
						style={{ cursor: 'pointer' }}
						href={TWITTER_LINK}
						target='_blank'
						rel='noreferrer'
					>{`Built by @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
