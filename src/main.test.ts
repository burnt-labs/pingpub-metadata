import {describe, expect, test} from '@jest/globals';
import ChainRegistryClient from "@ping-pub/chain-registry-client";
// import {sum} from './main';

describe('Fetch Mainnet From repository', () => {
  test('Loading Chain Lists', async () => {
    const client = new ChainRegistryClient()
    const chains = await client.fetchChainNames()
    expect(chains.length).toBeGreaterThan(0);
  });
});