import { describe, expect, test, beforeAll } from 'vitest'
import ChainRegistryClient from "@ping-pub/chain-registry-client";
// import {sum} from './main';
import * as fs from 'fs';
import fetch from 'cross-fetch';
import { createHash } from 'node:crypto'

function sha256(content) {  
    return createHash('sha256').update(content).digest('hex')
}

const client = new ChainRegistryClient()

// describe('Generate Token Metadata From Repository', async () => {

//     const chains = await client.fetchChainNames()
//     expect(chains).not.toBeNull()

//     test.each(chains.filter(x => x !== 'testnets'))('load chain assets (%s)', async (name) => {
//         expect(name).not.toBeNull()
//         const list = await client.fetchAssetsList(name)
//         expect(list).not.toBeNull()
//         list.assets.forEach((asset) => {
//             fs.writeFile(`metadata/${asset.base}`, JSON.stringify(asset), 'utf8', () => { })
//         })
//     })

// });

describe('Generate Token Metadata For IBC', async () => {

    const chains = await client.fetchChainNames()
    expect(chains).not.toBeNull()

    test.each(chains.filter(x => x !== 'testnets'))('load chain config (%s)', async (name) => {
        expect(name).not.toBeNull()
        const conf = await client.fetchChainInfo(name)
        expect(conf.apis?.rest).not.toBeNull()

        const endpoint = conf.apis?.rest
        expect(endpoint).not.toBeUndefined()
        if (endpoint) {
            const address = endpoint[0].address
            expect(address).not.toBeUndefined()
            // console.log(address + '/ibc/apps/transfer/v1/denom_traces?pagination.limit=1000')
            const resp = await fetch(address + '/ibc/apps/transfer/v1/denom_traces?pagination.limit=1000')
            expect(resp.ok).toBeTruthy()
            const traces: {
                denom_traces: {
                    path: string,
                    base_denom: string
                }[]
            } = await resp.json()
            expect(traces.denom_traces).not.toBeNull()
            traces.denom_traces.forEach((trace) => {
                const denom = trace.base_denom
                if(fs.existsSync(`dist/metadata/${denom}`)) {
                    const data = fs.readFileSync(`dist/metadata/${denom}`, 'utf8');
                    const metadata = JSON.parse(data)
                    if(metadata.base === denom){
                        const hash = sha256(`${trace.path}/${trace.base_denom}`).toUpperCase()
                        fs.writeFile(`dist/metadata/${hash}`, data, 'utf8', () => { })
                    }
                }
            })
        }

    })

});
