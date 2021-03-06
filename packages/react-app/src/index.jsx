import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { TokenAddressListProvider } from "./context/TokenAddressList";
import App from "./App";
import "./index.css";

// Rinkeby Server - Moralis
const APP_ID = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const SERVER_URL = "https://nroyfimbebmn.usemoralis.com:2053/server";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/dark-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
    <TokenAddressListProvider>
      <ApolloProvider client={client}>
        <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
          <App subgraphUri={subgraphUri} />
        </ThemeSwitcherProvider>
      </ApolloProvider>
    </TokenAddressListProvider>
  </MoralisProvider>,
  document.getElementById("root"),
);
