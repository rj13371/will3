import { PageHeader } from "antd";
import React from "react";

import { Collapse } from "antd";

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

export default function HowItWorks() {
  return (
    <div style={{ margin: "80px 0px" }}>
      <h2>How It Works</h2>
      <Collapse style={{ textAlign: "left" }} defaultActiveKey={["1"]} onChange={callback}>
        <Panel header="What is Will3?" key="1">
          <p>
            Will3 acts as a trustless executor sending predetermined assets to your designated benefactors upon your
            final life event.
          </p>
        </Panel>
        <Panel header="How do I use Will3?" key="2">
          <p>
            Connect your metamask and designate percentages of assets to your benefactories. In the event of your death,
            they will be dispersed accordingly. That's it. Easy!
          </p>
        </Panel>
        <Panel header="Why should I have a Will3?" key="3">
          <p>text</p>
        </Panel>
        <Panel header="When should I update my Will3?" key="4">
          <p>text</p>
        </Panel>
        <Panel header="What happens to the money in my wallet when I am not using it?" key="5">
          <p>text</p>
        </Panel>
        <Panel header="How should I prepare my wallet for Will3?" key="6">
          <p>text</p>
        </Panel>
        <Panel header="Can I designate money to charity in my Will3?" key="7">
          <p>text</p>
        </Panel>
      </Collapse>
    </div>
  );
}
