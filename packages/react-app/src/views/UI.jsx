import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance, Events, AssetSelector, HowItWorks, Team } from "../components";
import { Link } from "react-router-dom";

export default function UI({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  loadWeb3Modal,
  setRoute,
}) {
  const titleImage = "./../assets/will3.png";

  return (
    <div>
      <div style={{ padding: 16, width: "80%", margin: "auto", marginTop: 24, paddingBottom: 160 }}>
        <img src={titleImage} style={{ width: "25%" }} />
        <h2 style={{ marginTop: 24 }}>Blockchain is predictable. Life is not.</h2>
        <h5 style={{ marginTop: 48 }}>
          Keep your loved ones and assets safe in your death. Allocate your assets safely and in a trustless fashion.
          Using the Will3 protocol, Will3 will monitor your life status and in the event of your death, confirm and
          honor your last wishes. Decentralized death is a trustless way to make sure your crypto assets end up in the
          right hands.
        </h5>
        <div style={{ margin: 8, marginBottom: 80 }}>
          {!address ? (
            <Button className="connect-wallet-button" onClick={loadWeb3Modal}>
              Connect your wallet to continue
            </Button>
          ) : (
            <Button className="connect-wallet-button">
              <Link
                onClick={() => {
                  setRoute("/will3");
                }}
                to="/will3"
              >
                Enter App
              </Link>
            </Button>
          )}
        </div>
        <HowItWorks />
        <Team />
      </div>
    </div>
  );
}
