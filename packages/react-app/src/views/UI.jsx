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
        <h5 style={{ width: "800px", margin: "auto", marginTop: 24, fontWeight: "normal" }}>
          Allocate your assets safely and in a trustless fashion. Will3 monitors your life status and in the event of
          your death, confirms and honors your last wishes. Decentralize death and make sure your crypto assets end up
          in the right hands.
        </h5>
        <div style={{ margin: 8, marginBottom: 80, marginTop: 24 }}>
          {!address ? (
            <Button className="connect-wallet-button" onClick={loadWeb3Modal}>
              <h5 style={{ color: "black" }}>Connect your wallet to continue</h5>
            </Button>
          ) : (
            <Button style={{ height: "auto" }} className="connect-wallet-button">
              <Link
                onClick={() => {
                  setRoute("/will3");
                }}
                to="/will3"
              >
                <h5 style={{ color: "black", margin: "auto" }}>Enter App</h5>
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
