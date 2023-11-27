import useWeb3AuthStore from "../store/web3-auth";

export default function Dashboard() {
  const store = useWeb3AuthStore()
  const isConnected = store.isConnected()

  return (
      isConnected ? (
        <center style={{color: 'red'}}>!!! Placeholder !!!</center>
      ) : (
        <center style={{color: 'red'}}>Please login to view this page</center>
      )
  )
}
