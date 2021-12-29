import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/junoware/moralis-avalanche-hackathon-2" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Will 3"
        subTitle="Decentralized Death!!"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
