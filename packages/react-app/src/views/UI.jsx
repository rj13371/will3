import { Button, Image, Layout } from "antd";
import React, { useState } from "react";
import { HowItWorks, Team } from "../components";
import { Link } from "react-router-dom";

export default function UI({ address, loadWeb3Modal, setRoute }) {
  const titleImage = "./../assets/will3.png";
  const homePageGif = "./../assets/digging.gif";
  const chainlink = "./../assets/chainlink.svg";
  const avaxLogo = "./../assets/avaxLogo.svg";
  const moralis = "./../assets/Moralis.svg";

  const { Header, Content, Footer } = Layout;

  return (
    <Layout style={{ backgroundColor: "#0F0E0E" }}>
      <Content
        style={{
          padding: 16,
          width: "80%",
          margin: "auto",
          marginTop: 24,
          paddingBottom: 160,
        }}
      >
        <img src={titleImage} style={{ width: "25%" }} />
        <h2 style={{ marginTop: 24, fontSize: 36 }}>Blockchain is predictable. Life is not.</h2>
        <h5 style={{ width: "800px", margin: "auto", marginTop: 24, fontWeight: "normal" }}>
          Allocate your assets safely and in a trustless fashion. Will3 monitors your life status and in the event of
          your death, confirms and honors your last wishes. Decentralize death and make sure your crypto assets end up
          in the right hands.
        </h5>
        <div style={{ margin: 8, marginBottom: 60, marginTop: 24 }}>
          {!address ? (
            <Button className="connect-wallet-button" onClick={loadWeb3Modal}>
              <h5 style={{ color: "black" }}>Connect your wallet to continue</h5>
            </Button>
          ) : (
            <Button
              style={{ height: "auto", width: "120px" }}
              shape="round"
              size="large"
              className="connect-wallet-button"
            >
              <Link
                onClick={() => {
                  setRoute("/will3");
                }}
                to="/will3"
              >
                <h6 style={{ color: "black", margin: "auto" }}>Enter App</h6>
              </Link>
            </Button>
          )}
        </div>
        <Image width={500} src={homePageGif} style={{ border: "2px solid white" }} />
        <HowItWorks />
        <Team />
      </Content>
      <Footer style={{ backgroundColor: "#0F0E0E" }}>
        <p> Powered by</p>
        <Image style={{ padding: "5px" }} width={100} height={40} src={chainlink} />
        <Image style={{ padding: "5px" }} width={150} height={40} src={avaxLogo} />
        <Image style={{ padding: "5px" }} width={130} height={40} src={moralis} />
      </Footer>
    </Layout>
  );
}
