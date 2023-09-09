import ChainRegistryClient from "@ping-pub/chain-registry-client";

const client = new ChainRegistryClient()
client.fetchChainNames().then((chainNames) => {
  console.log(chainNames)
})