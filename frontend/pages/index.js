import { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

export default function Home() {
    const [connected, setConnected] = useState(false);
    const [whitelisted, setWhitelisted] = useState(false);
    const [privateInfo, setPrivateInfo] = useState('');
    const [newInfo, setNewInfo] = useState('');
    const [contract, setContract] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [whitelist, setWhitelist] = useState([]);
    const [loading, setLoading] = useState(false);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();

                const contractAddress = "0xYourContractAddress"; 
                const abi = [ /* Copia el ABI desde el archivo JSON generado por Hardhat */ ];

                const contract = new ethers.Contract(contractAddress, abi, signer);
                setContract(contract);

                const isWhitelisted = await contract.isWhitelisted(address);
                setWhitelisted(isWhitelisted);

                if (isWhitelisted) {
                    const info = await contract.getPrivateInfo();
                    setPrivateInfo(info);
                }

                const owner = await contract.owner();
                setIsOwner(address === owner);

                if (address === owner) {
                    const whitelistAddresses = await contract.getWhitelistAddresses(); // Funcion en el contrato
                    setWhitelist(whitelistAddresses);
                }

                setConnected(true);
            } catch (error) {
                console.error(error);
                alert("Error connecting to wallet.");
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const updateInfo = async () => {
        if (!newInfo.trim()) {
            alert("Please enter valid information.");
            return;
        }

        try {
            setLoading(true);
            const tx = await contract.updatePrivateInfo(newInfo);
            await tx.wait(); // Espera a que la transaccion se mine
            const info = await contract.getPrivateInfo();
            setPrivateInfo(info);
            alert("Info updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update info. Make sure you are the owner.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg"
            >
                <h1 className="text-2xl font-bold mb-4">Private Info Storage</h1>
                {!connected ? (
                    <button
                        onClick={connectWallet}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Connecting..." : "Connect Wallet"}
                    </button>
                ) : (
                    <>
                        {whitelisted ? (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <p className="mb-4">Private Info: {privateInfo}</p>
                                </motion.div>
                                {isOwner && (
                                    <>
                                        <input
                                            type="text"
                                            value={newInfo}
                                            onChange={(e) => setNewInfo(e.target.value)}
                                            className="border p-2 rounded mb-4"
                                            placeholder="Enter new info"
                                        />
                                        <button
                                            onClick={updateInfo}
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                            disabled={loading}
                                        >
                                            {loading ? "Updating..." : "Update Info"}
                                        </button>
                                    </>
                                )}
                                {isOwner && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="mt-4"
                                    >
                                        <h2 className="text-xl font-bold mb-2">Whitelist</h2>
                                        <ul>
                                            {whitelist.map((address, index) => (
                                                <li key={index} className="mb-1">
                                                    {address}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <p className="text-red-500">You are not whitelisted.</p>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}