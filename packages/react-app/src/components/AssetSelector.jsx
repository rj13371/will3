import { Switch, Menu, Dropdown, Input, Select } from "antd";
import React from "react";
const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}
function callback(key) {
  console.log(key);
}

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

const text = `We ask that you please provide percentages and wallet addresses for your benefactor allotment of your assets.`;

export default function AssetSelector() {
  return (
    <div>
      <Switch defaultChecked onChange={onChange} />
      <Select defaultValue="AVA" style={{ width: 120, margin: "0px 20px" }} onChange={handleChange}>
        <Option value="AVA">AVA</Option>
        <Option value="ETH">ETH</Option>
        <Option value="BTC">BTC</Option>
        <Option value="PUNK" disabled>
          CryptoPunks
        </Option>
        <Option value="BAYC" disabled>
          Bored Ape Yacht Club
        </Option>
      </Select>
        %
      <Input
        onChange={e => {
          console.log(e.target.value);
        }}
        style={{ width: 50 }}
      />
      <Input
        onChange={e => {
          console.log(e.target.value);
        }}
        style={{ width: 400, minWidth: 300, margin: "0px 20px" }}
      />
    </div>
  );
}
