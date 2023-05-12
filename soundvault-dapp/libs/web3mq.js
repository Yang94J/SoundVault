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

const login = async (params) => {

    const password = Web3MQApi.password;

    const didType = 'eth' // or 'starknet';
    const didValue = params.account;


    const bestEndpointUrl = await Client.init({
        connectUrl: '', //
        app_key: Web3MQApi.appId, // temporary authorization key obtained by applying, will be removed in future testnets and mainnet
    });


// 1. connect wallet and get user
    const {userid, userExist} = await Client.register.getUserInfo({
        did_value:  didValue,
        did_type: didType,
    });


    // 2. create main key pairs
    
    const {signContent} = await Client.register.getMainKeypairSignContent({
        password: password,
        did_value: didValue,
        did_type: didType,
    });

    const signature = await (params.signer).signMessage(signContent);

    const {publicKey, secretKey} = await Client.register.getMainKeypairBySignature(
        signature,
        password
    );

      
    if (!userExist) {
        console.log("registering ...");
        const {signContent} = await Client.register.getRegisterSignContent({
            userid,
            mainPublicKey: publicKey,
            didType,
            didValue,
        });

        console.log("Sign msg for register")
        const signature = await (params.signer).signMessage(signContent);

        const did_pubkey = '';
        
        const registerParams = {
            userid,
            didValue,
            mainPublicKey: publicKey,
            did_pubkey,
            didType,
            nickname: '',
            avatar_url: '',
            signature,
        };

        const registerRes = await Client.register.register(registerParams);
        console.log(registerRes)
    }


// // login func
    console.log("login");
    const {
        tempPrivateKey,
        tempPublicKey,
        pubkeyExpiredTimestamp,
        mainPrivateKey,
        mainPublicKey,
    } = await Client.register.login({
        password,
        mainPublicKey: publicKey,
        mainPrivateKey: secretKey,
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