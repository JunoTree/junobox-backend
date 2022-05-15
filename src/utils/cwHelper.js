import { makeCosmoshubPath } from "@cosmjs/amino";
import { coins, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsDeliverTxSuccess, calculateFee, GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const TOKEN_SYMBOL = 'upebble';
const RPC_ENDPOINT = 'https://rpc.cliffnet.cosmwasm.com:443';
const WALLET_PREFIX = 'wasm';
const GAS_LIMIT = 200_000;
const GAS_PRICE = 0.025;

class CwHelper {
  constructor() {}

  initialize = async () => {
    const mnemonic = process.env.MNEMONIC;
    
    // Setup wallet
    const path = makeCosmoshubPath(0);
    this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { hdPaths: [path], prefix: WALLET_PREFIX });

    // Setup account
    const [account] = await this.wallet.getAccounts();
    this.account = account;

     // Setup client
    this.client = await SigningCosmWasmClient.connectWithSigner(RPC_ENDPOINT, this.wallet);

    console.log('CwHelper initialized!');
  }

  getGasPrice = () => GasPrice.fromString(`${GAS_PRICE}${TOKEN_SYMBOL}`);

  getFree = () => calculateFee(GAS_LIMIT, this.getGasPrice());

  transfer = async (recipient, amount, memo) => {
    const amountObj = coins(amount, TOKEN_SYMBOL);
    const fee = this.getFree();
    const result = await this.client.sendTokens(this.account.address,
      recipient,
      amountObj,
      fee,
      memo,
    );
    assertIsDeliverTxSuccess(result);
    console.log("Successfully broadcasted:", result);
  }

  createBox = async (boxes) => {
    const createBoxes = {
      create_boxes: { boxes }
    };
    const fee = this.getFree();
    const result = await this.client.execute(this.account.address, process.env.CONTRACT_ADDRESS, createBoxes, fee, "", coins(amount, TOKEN_SYMBOL));
    console.log('createBoxes, result: ', result);
  }
}

export default new CwHelper;
