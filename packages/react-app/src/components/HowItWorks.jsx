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
      <Collapse style={{ textAlign: "left" }} defaultActiveKey={["1"]} onChange={callback} accordion>
        <Panel header="What is Will3?" key="1">
          <p>
            Will3 acts as a trustless executor. It disburses predetermined assets to your designated benefactors in the
            event of your death.
          </p>
        </Panel>
        <Panel header="How do I use Will3?" key="2">
          <p>
            Connect your metamask and designate percentages of assets to your benefactories. In the event of your death,
            they will be disbursed accordingly. That's it. Easy!
          </p>
        </Panel>
        <Panel header="Why should I have a Will3?" key="3">
          <p>
            Let's face it: creating a will isn't very high on our to-do list. That probably explains why most people
            don't have one. Confronting our mortality can be uncomfortable, and it's easy to put it off. But you don't
            want your assets to become cold, like your dead body. Be smart, use Will3, make sure part of you lives on.
          </p>
        </Panel>
        <Panel header="When should I update my Will3?" key="4">
          <p>Life happens, as does death. It is recommended to revisit your Will3 designations in the event of:</p>
          <ul>
            <li>Getting married or divorced</li>
            <li>Having children or grandchildren</li>
            <li>If one of your beneficiaries or executors passes away</li>
          </ul>
        </Panel>
        <Panel header="What happens to the assets in my wallet when I am not using it?" key="5">
          <p>
            You can continue to use your wallet like normal, or you can designate the money into an interest-earning
            liquidity pool.
          </p>
        </Panel>
        <Panel header="How should I prepare my wallet for Will3?" key="6">
          <p>
            The beauty of Will3 is you can continue using your wallet as normal, or create one using a designated wallet
            that you leave inactive. It is recommend to have Will3 on every wallet you own in the case of unforeseen
            life events. Will3 disbursements are designated using percentages; your wallet can have limited assets in it
            or a wide assortment.
          </p>
        </Panel>
        <Panel header="Can I designate money to charity in my Will3?" key="7">
          <p>
            Absolutely! And we highly recommend it. We have a number of charitable options available through Gitcoin
            grants.
          </p>
        </Panel>
      </Collapse>
    </div>
  );
}
