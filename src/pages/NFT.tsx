import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { InBrowserWalletManager } from '@/lib/walletManager';

const NFT_CONTRACT_ADDRESS = '0xYourNFTContractAddress'; // Replace with your contract address
const NFT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function safeTransferFrom(address from, address to, uint256 tokenId) external',
  // 'function mint(address to, string memory tokenURI) public returns (uint256)', // Uncomment if your contract supports minting
];

export default function NFTPage() {
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const addr = InBrowserWalletManager.getAddress();
    setAddress(addr);
    setPrivateKey(InBrowserWalletManager.getPrivateKey());
    fetchEthBalance(addr);
    fetchNFTs(addr);
  }, []);

  const fetchEthBalance = async (addr: string) => {
    const provider = ethers.getDefaultProvider();
    const balance = await provider.getBalance(addr);
    setEthBalance(ethers.formatEther(balance));
  };

  const fetchNFTs = async (userAddress: string) => {
    setLoading(true);
    const provider = ethers.getDefaultProvider(); // Uses public RPC
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    const nftList = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
      const tokenURI = await contract.tokenURI(tokenId);
      const uri = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const meta = await fetch(uri).then(res => res.json());
      nftList.push({ tokenId, ...meta });
    }
    setNfts(nftList);
    setLoading(false);
  };

  const transferNFT = async () => {
    const wallet = InBrowserWalletManager.getWallet();
    const provider = ethers.getDefaultProvider();
    const signer = wallet.connect(provider);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    try {
      setStatus('Sending transaction...');
      const tx = await contract.safeTransferFrom(address, to, tokenId);
      await tx.wait();
      setStatus('Transfer successful!');
      fetchEthBalance(address); // Refresh balance after transfer
    } catch (err) {
      setStatus('Transfer failed: ' + (err as any).message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-white">NFT Operations</h2>
      <div className="mb-4 p-4 bg-slate-800 rounded">
        <div className="text-purple-300 text-xs mb-1">Your Wallet Address:</div>
        <div className="text-white font-mono break-all mb-2">{address}</div>
        <div className="text-purple-300 text-xs mb-1">Private Key:</div>
        <div className="text-white font-mono break-all mb-2">{privateKey}</div>
        <div className="text-purple-300 text-xs mb-1">ETH Balance:</div>
        <div className="text-green-400 font-mono text-lg">{parseFloat(ethBalance).toFixed(4)} ETH</div>
      </div>
      {loading && <div className="text-purple-300">Loading NFTs...</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="bg-slate-800 rounded-lg p-2">
            <img src={nft.image} alt={nft.name} className="rounded mb-2" />
            <div className="text-white font-bold">{nft.name || 'Unnamed NFT'}</div>
            <div className="text-xs text-purple-300">Token ID: {nft.tokenId.toString()}</div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800 p-4 rounded-lg mb-8">
        <h3 className="text-white font-bold mb-2">Transfer NFT</h3>
        <input
          className="mb-2 p-2 rounded w-full"
          placeholder="Token ID"
          value={tokenId}
          onChange={e => setTokenId(e.target.value)}
        />
        <input
          className="mb-2 p-2 rounded w-full"
          placeholder="Recipient Address"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
        <button
          onClick={transferNFT}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Transfer
        </button>
        <div className="text-purple-300 mt-2">{status}</div>
      </div>
      {/* Minting UI can be added here if your contract supports it */}
    </div>
  );
} 