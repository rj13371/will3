import { PageHeader, Card } from "antd";
import React from "react";

const { Meta } = Card;

function callback(key) {
  console.log(key);
}

const gingeImage = "assets/ginge.png";
const rolandImage = "assets/roland.png";
const yamboImage = "assets/yambo.png";

const gingeTwitterUrl = "https://www.twitter.com/ginge_eth";
const rolandTwitterUrl = "https://twitter.com/rj13371";
const yamboTwitterUrl = "https://www.twitter.com/yambo_eth";

const cardMargin = "0px 25px";

// shows a display of the team
export default function Team() {
  return (
    <div style={{ marginTop: 80 }}>
      <h2>Will3 Caretakers</h2>
      <Card
        hoverable
        onClick={() => {
          window.open(rolandTwitterUrl);
        }}
        style={{ width: 240, display: "inline-block", margin: cardMargin }}
        cover={<img alt="example" src={rolandImage} />}
      >
        <Meta title="Roland" description="@rj13371" />
      </Card>
      <Card
        hoverable
        onClick={() => {
          window.open(gingeTwitterUrl);
        }}
        style={{ width: 240, display: "inline-block", margin: cardMargin }}
        cover={<img alt="example" src={gingeImage} />}
      >
        <Meta title="ginge.eth" description="@ginge_eth" />
      </Card>
      <Card
        hoverable
        onClick={() => {
          window.open(yamboTwitterUrl);
        }}
        style={{ width: 240, display: "inline-block", margin: cardMargin }}
        cover={<img alt="example" src={yamboImage} />}
      >
        <Meta title="yambo.eth" description="@yambo_eth" />
      </Card>
    </div>
  );
}
