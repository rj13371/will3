import { PageHeader } from "antd";
import React from "react";

// displays a page header

const logo = "assets/will3logo.png";

export default function Header() {
  return (
    <a href="./" rel="noopener noreferrer">
      <PageHeader avatar={{ src: logo }} subTitle="Your last wishes, decentralized." style={{ cursor: "pointer" }} />
    </a>
  );
}
