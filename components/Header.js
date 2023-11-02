import { ConnectButton } from "web3uikit"
// import styles from "../styles/Home.module.css"

export default function Header() {
    return (
        <nav style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <h1 > Banking Dapp </h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}