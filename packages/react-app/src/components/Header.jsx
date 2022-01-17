import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="./" rel="noopener noreferrer">
      <PageHeader
        avatar={{ src: "https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" }}
        subTitle="Your last wishes, decentralized."
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
