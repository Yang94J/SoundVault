import {Client, KeyPairsType, WalletType} from "@web3mq/client";
import Web3MQApi from "@/config/apikey/web3mqapi";

// --------------------------------- generate Info ------------------------------------

const PREFIX_CHAT = "CHAT";
const PREFEX_TOPIC = "TOPIC";

// test purpose
const SUFFIX = "test0";

const generateChat = (address) => {
    return PREFIX_CHAT + "_" +  address.slice(-5) + "_" + SUFFIX;
}

const generateTopic = (address) => {
    return PREFIX_CHAT + "_" +  address.slice(-5) + "_" + SUFFIX;
}

let instance = undefined;
// ------------------------------- web3mq login --------------------------------------------

// You can save the bestEndpointUrl locally to skip endpoint search next time, which will save time, and


const login = async () => {
    const password = Web3MQApi.passworc;
    const didType = 'eth' // or 'starknet';

    const bestEndpointUrl = await Client.init({
        connectUrl: '', //
        app_key: Web3MQApi.appId, // temporary authorization key obtained by applying, will be removed in future testnets and mainnet
    });

// 1. connect wallet and get user
    const {address: didValue} = await Client.register.getAccount(didType);
    const {userid, userExist} = await Client.register.getUserInfo({
        did_value: didValue,
        did_type: didType,
    });

    console.log("get User ", didValue);

// 2. create main key pairs
    const {publicKey: localMainPublicKey, secretKey: localMainPrivateKey} = await Client.register.getMainKeypair({
        password,
        did_value: didValue,
        did_type: didType,
    });

    if (!userExist) {
//    register func
        const {signContent} = await Client.register.getRegisterSignContent({
            userid,
            mainPublicKey: localMainPublicKey,
            didType,
            didValue,
        });
        const {sign: signature, publicKey: did_pubkey = ""} =
            await Client.register.sign(signContent, didValue, didType);
        const params = {
            userid,
            didValue,
            mainPublicKey: localMainPublicKey,
            did_pubkey,
            didType,
            nickname: "",
            avatar_url: `https://cdn.stamp.fyi/avatar/${didValue}?s=300`,
            signature,
        };
        const registerRes = await Client.register.register(params);
        console.log(registerRes)
    }
// login func
    const {
        tempPrivateKey,
        tempPublicKey,
        pubkeyExpiredTimestamp,
        mainPrivateKey,
        mainPublicKey,
    } = await Client.register.login({
        password,
        mainPublicKey: localMainPublicKey,
        mainPrivateKey: localMainPrivateKey,
        userid,
        didType,
        didValue,
    });

    const keys = {
        PrivateKey: tempPrivateKey,
        PublicKey: tempPublicKey,
        userid: userid
    };

    instance = Client.getInstance(keys);
}

export {login,instance}