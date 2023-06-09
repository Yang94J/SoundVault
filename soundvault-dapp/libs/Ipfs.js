import axios from "axios";
import PNApi from '@/config/apikey/PNapi';
import { ethers } from "ethers";


const IPFS_URL = 'https://rpc.particle.network/ipfs/upload';
const IPFS_URLJSON = 'https://rpc.particle.network/ipfs/upload_json';
const IPFS_AUDIOPREFIX = "https://ipfs.particle.network/"    

const uploadJson = async function(data) {
    let res = (await axios.post(IPFS_URLJSON, 
        data,
        {
            auth: {
                username: PNApi.projectId,
                password: PNApi.serverKey,
            },
        }
    )).data;
    

    const resp = {
        "cid" : res.cid,
        "ipfs" : res.ipfs,
        "url" : res.ipfsUrl,
    };

    return resp;
}

const uploadFile = async function(file){

    const form = new FormData();
    console.log(file);
    form.append('file', file);

    console.log(form);

    let res = await axios.post(IPFS_URL, form, {
        // headers: form.getHeaders(),
        auth: {
            username: PNApi.projectId,
            password: PNApi.serverKey,
        },
    });

    res = res.data;

    const resp = {
        "cid" : res.cid,
        "ipfs" : res.ipfs,
        "url" : res.ipfsUrl,
    };

    return resp;
}

export { uploadJson, uploadFile,IPFS_AUDIOPREFIX };
