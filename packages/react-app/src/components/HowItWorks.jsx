import { PageHeader } from "antd";
import React from "react";

import { Collapse } from "antd";

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const text = `We ask that you please provide percentages and wallet addresses for your benefactor allotment of your assets.`;

// displays a page header

export default function HowItWorks() {
  return (
    <>
      <h2>How It Works</h2>
      <Collapse style={{ textAlign: "left" }} defaultActiveKey={["1"]} onChange={callback}>
        <Panel header="This is panel header 1" key="1">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 2" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 3" key="3">
          <p>{text}</p>
        </Panel>
      </Collapse>
    </>
  );
}
