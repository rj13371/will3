import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance, Events, AssetSelector, HowItWorks, Team } from "../components";

export default function UI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  loadWeb3Modal,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");
  const titleImage = "./../assets/will3.png";

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, width: "80%", margin: "auto", marginTop: 24, paddingBottom: 160 }}>
        <img src={titleImage} />
        <h1 style={{ marginTop: 24 }}>Blockchain is predictable. Life is not.</h1>
        <h4 style={{ marginTop: 48 }}>
          Keep your loved ones and assets safe in your death. Allocate your assets safely and in a trustless fashion.
          Using the Will3 protocol, Will3 will monitor your life status and in the event of your death, confirm and
          honor your last wishes. Decentralized death is a trustless way to make sure your crypto assets end up in the
          right hands.
        </h4>
        <div style={{ margin: 8, marginBottom: 80 }}>
          {!address ? (
            <Button className="connect-wallet-button" onClick={loadWeb3Modal}>
              Connect your wallet to continue
            </Button>
          ) : (
            <Button
              className="connect-wallet-button"
              onClick={() => {
                console.log("clicked");
              }}
            >
              Create or Edit your Will3
            </Button>
          )}
        </div>
        <HowItWorks />
        <Team />
      </div>
    </div>
  );
}
