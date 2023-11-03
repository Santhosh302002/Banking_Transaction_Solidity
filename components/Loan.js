import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import abi from "../constants/createBankingABI.json"
import { useNotification } from "web3uikit";

const divStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
};

const inputStyle = {
    margin: '10px 0',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '200px',
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    margin: '5px'
};

export default function Loan() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const dispatch = useNotification()
    const [loan, setloan] = useState(0)
    const [replayloan, setreplayloan] = useState(0)
    const DappAddress = "0x095B26705eB8Fe87c01e1BC01CBF8593620CDA75";

    const {
        runContractFunction: LOAN,
        data: enterTxResponse,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: DappAddress,
        functionName: "LOAN",
        params: { RequestedLoanValue: loan }
    })
    const {
        runContractFunction: PayLoan,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: DappAddress,
        functionName: "PayLoan",
        msgValue: replayloan
    })

    const {
        runContractFunction: loanAmount,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: DappAddress,
        functionName: "loanAmount",
    })

    async function updateUIValues() {
        // const web3 = await Moralis.enableWeb3();
        // console.log(money)
        // console.log(paymentMoney)
        const loanamount = await loanAmount(
            {
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            }
        )
        console.log(loanamount)
        setreplayloan(loanamount.toString())

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
        <div>
            <div>
                Your Loan:
                {replayloan}
            </div>
            <div style={divStyle}>
                <input type="number" style={inputStyle} onChange={(e) => setloan(e.target.value)} />
                <button style={buttonStyle} onClick={async () => await LOAN(
                    {
                        onSuccess: handleSuccess,
                        onError: (error) => console.log(error),
                    }
                )}>Submit</button>
                <button style={buttonStyle} onClick={async () => await PayLoan(
                    {
                        onSuccess: handleSuccess,
                        onError: (error) => console.log(error),
                    }
                )}>Repay</button>
            </div>
        </div>
    )
}