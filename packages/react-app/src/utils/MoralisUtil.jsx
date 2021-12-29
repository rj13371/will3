import React, {useEffect} from 'react'
import { useMoralis } from "react-moralis";
import Moralis from 'moralis';
import { NETWORK, NETWORKS } from '../constants'

const appId = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const serverUrl = "https://nroyfimbebmn.usemoralis.com:2053/server";


export default function MoralisUtil(props) {

    Moralis.start({ serverUrl, appId });

    useEffect(()=>{

        (async () => {
            const options = { chain: `0x4` , address: `${props.userAddress}` }
            const balances = await Moralis.Web3API.account.getTokenBalances(options);

            console.log(`MORALIS TOKEN BALANCE`,balances)
        })();

    },[])

    return (
        <div>
           test 
        </div>
    )
}
