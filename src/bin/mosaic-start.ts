#!/usr/bin/env node

import * as commander from 'commander';
import { version } from '../../package.json';
import NodeFactory from '../Node/NodeFactory';
import Node from '../Node/Node';
import NodeOptions from './NodeOptions';
import Logger from '../Logger';

let mosaic = commander
  .version(version)
  .arguments('<chain>');

mosaic = NodeOptions.addCliOptions(mosaic);

mosaic
  .option('-u,--unlock <accounts>', 'a comma separated list of accounts that get unlocked in the node; you must use this together with --password')
  .option('-s,--password <file>', 'the path to the password file on your machine; you must use this together with --unlock')
  .action((chain: string, options) => {
    let {
      mosaicDir,
      port,
      rpcPort,
      websocketPort,
      keepAfterStop,
      unlock,
      password,
    } = NodeOptions.parseOptions(options);

    const chainId = NodeFactory.getChainId(chain);
    if (port === undefined) {
      port = NodeOptions.getPortForChainId(chainId);
    }
    if (rpcPort === undefined) {
      rpcPort = NodeOptions.getRpcPortForChainId(chainId);
    }
    if (websocketPort === undefined) {
      websocketPort = NodeOptions.getWsPortForChainId(chainId);
    }

    const node: Node = NodeFactory.create({
      chainId: chain,
      mosaicDir,
      port,
      rpcPort,
      websocketPort,
      keepAfterStop,
      unlock,
      password,
    });

    node.start();
  })
  .parse(process.argv);
