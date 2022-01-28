import { PageHeader } from "antd";
import React from "react";

// displays a page header

const will3CircleIcon = "assets/will3-circle.png";

export default function Header() {
  return (
    <a href="./" rel="noopener noreferrer">
      <PageHeader
        avatar={{ src: will3CircleIcon }}
        subTitle="Your last wishes, decentralized."
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
