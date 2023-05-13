import {Client, KeyPairsType, WalletType} from "@web3mq/client";
import Web3MQApi from "@/config/apikey/web3mqapi";

// --------------------------------- generate Info ------------------------------------

const PREFIX_CHAT = "CHAT";
const PREFEX_TOPIC = "TOPIC";

// test purpose
const SUFFIX = "test0";


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

    console.log("didValue",didValue);

// 1. connect wallet and get user
    const {userid, userExist} = await Client.register.getUserInfo({
        did_value:  didValue,
        did_type: didType,
    });

    console.log("userId",userid);
    console.log("userExist",userExist);

    let publicKey = localStorage.getItem(didValue+"pub") || "";
    let secretKey = localStorage.getItem(didValue+"sec") || "";

    console.log("get publicKey",publicKey);
    if (publicKey!=""){
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
        
        console.log("login with pubkey and secret saved");
        instance = Client.getInstance(keys);
    }else{
   // 2. create main key pairs

        const {signContent} = await Client.register.getMainKeypairSignContent({
            password: password,
            did_value: didValue,
            did_type: didType,
        });

        const signature = await ((params.signer).signMessage(signContent));


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
        }
        localStorage.setItem(didValue+"pub",publicKey);
        localStorage.setItem(didValue+"sec",secretKey);
        console.log("save publicKey");

        // // // login func
        //     console.log("login");

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

        console.log("login with pubkey and secret requested via signing");
        instance = Client.getInstance(keys);
    }

 
}

export {login,instance}