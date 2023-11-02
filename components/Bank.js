import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import abi from "../constants/createBankingABI.json"
import { useNotification } from "web3uikit";


export default function Bank() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const [money, setmoney] = useState(0);
    const [balance, setbalance] = useState(0);
    const [withdraw, setwithdraw] = useState(0);
    const [Transfer, setTransfer] = useState("");
    const [Transfermoney, setTransfermoney] = useState(0);
    const dispatch = useNotification()
    const DappAddress = "0x0FE5c4ae204c9134dd6146271d64d22A331da7c2";

    const {
        runContractFunction: payment,
        data: enterTxResponse,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: DappAddress,
        functionName: "payment",
        msgValue: money,
    })

    const {
        runContractFunction: withDraw,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: DappAddress,
        functionName: "withDraw",
        params: { value: withdraw }
    })

    const {
        runContractFunction: send_from_BankAccount,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: DappAddress,
        functionName: "send_from_BankAccount",
        params: { to_receiever: Transfer, value: Transfermoney }
    })



    async function updateUIValues() {
        // const web3 = await Moralis.enableWeb3();
        // console.log(money)
        // console.log(paymentMoney)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="banner">
            <div className="Balance">

            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                <input
                    type="number"
                    placeholder="Enter a number"
                    onChange={(e) => { setmoney((e.target.value).toString()) }}
                    style={{
                        padding: '12px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        width: '200px',
                        textAlign: 'center',
                        margin: '12px'
                    }}
                />
                <button
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: 'skyblue',
                        border: 'none',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        cursor: 'pointer',
                    }}
                    onClick={async () => await payment(
                        {
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        }
                    )}
                >
                    Submit
                </button>

            </div>
            <div className="withdraw" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <input
                    type="number"
                    placeholder="Enter a number"
                    onChange={(e) => { setwithdraw((e.target.value).toString()) }}
                    style={{
                        padding: '12px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        width: '200px',
                        textAlign: 'center',
                        margin: '12px'
                    }}
                />
                <button
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: 'skyblue',
                        border: 'none',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        cursor: 'pointer',
                    }}
                    onClick={async () => await withDraw(
                        {
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        }
                    )}
                >
                    withDraw
                </button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <input
                    type="text"
                    placeholder="Enter text"
                    style={{ marginRight: '10px', padding: '5px' }}
                    onChange={(e) => { setTransfer((e.target.value).toString()) }}
                />
                <input
                    type="number"
                    placeholder="Enter number"
                    style={{ marginRight: '10px', padding: '5px' }}
                    onChange={(e) => { setTransfermoney((e.target.value).toString()) }}
                />
                <button

                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    onClick={async () => await send_from_BankAccount(
                        {
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        }
                    )}
                >
                    Transfer
                </button>
            </div>
        </div >
    );
}