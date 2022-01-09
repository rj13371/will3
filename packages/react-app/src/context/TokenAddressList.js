import React, { createContext, useState } from "react";

export const TokenAddressListContext = createContext();

//simple context to share state of tokens grabbed from Moralis web3 API and scaffold eth

export function TokenAddressListProvider(props) {

    const [tokenList, setTokenList] = useState([]);

    const updateTokenList = (val) => {
        const moralisTokens = val
        console.log(val)

        setTokenList([...moralisTokens])
    }

    return (
        <TokenAddressListContext.Provider value={{ tokenList, updateTokenList }}>
            {props.children}
        </TokenAddressListContext.Provider>
    );
}
