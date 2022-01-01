import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance, Events, AssetSelector, HowItWorks, Team, MoralisUtil } from "../components";

export default function Will3({
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
  const titleImage = "./../assets/will3.png";

  return (
    <div>
      <div style={{ padding: 16, width: "80%", margin: "auto", marginTop: 24, paddingBottom: 160 }}>
        {address ? <MoralisUtil userAddress={address} /> : ``}
      </div>
    </div>
  );
}
