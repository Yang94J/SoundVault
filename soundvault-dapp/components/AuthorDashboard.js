import { useAccount,useParticleProvider} from "@particle-network/connect-react-ui";
import getMusicVault from "@/libs/musicVault";
import { ethers } from 'ethers';

import { useState , useEffect} from 'react';
import { useRouter } from 'next/router';
import StatisticCard from './ui/StatisticCard/StatisticCard';
import Button from './ui/Button/Button';
import { Snackbar, Alert } from "@mui/material";
import UploadForm from "./UploadForm";
import { uploadFile,uploadJson } from "@/libs/Ipfs";
import { login, instance } from "@/libs/web3mq";
import getVaultToken from "@/libs/vaultToken";


const CREATE_BASE_FEE = ethers.utils.parseUnits("10","ether").toString();

export default function AuthorDashboard(){

    const account = useAccount(); 
    let provider = undefined;
    let musicVault = undefined;
    let vaultToken = undefined;
    let signer = undefined;

    const [ownedMusic, setOwnedMusic] = useState(-1);
    const [totalPurchases, setTotalPurchases] = useState(-1);
    const [totalTokenReceived, setTotalTokenReceived] = useState(-1);
    const [totalVotes, setTotalVotes] = useState(-1);
    const [totalFanNumber,setTotalFanNumber] = useState(-1);
    const [musicList,setMusicList] = useState([])
    const [fanNFT,setFanNFT] = useState(ethers.constants.AddressZero);

    const [openS, setOpenS] = useState(false);
    const [openE, setOpenE] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [render,setRender] = useState(0);

    if (account != undefined && account != ""){
        const web3provider = useParticleProvider();
        provider = new ethers.providers.Web3Provider(web3provider);
        musicVault = getMusicVault(provider);
        signer = provider.getSigner();
    }


    useEffect(() => {
        async function fetchDataAsync() {
            if (provider != undefined) {
                await fetchData();
            }
        }
        fetchDataAsync();
    }, [account]);



    const fetchData = async function() {
        console.log("fetching data for user profile")
        const user = await musicVault.address2UserMapping(account);
        setOwnedMusic((await musicVault.getOwnerMusicNumber(account)).toNumber());
        setTotalPurchases((user.soldCopy).toNumber());
        setTotalTokenReceived(ethers.utils.formatUnits(user.totalRevenue,"ether"));
        setTotalVotes(user.receivedVote.toNumber());
        setTotalFanNumber((await musicVault.getFanNumber(account)).toNumber());
        setFanNFT(user.fanNFT);
        const ownerMusicIdList = await musicVault.getOwnerMusicIdList(account);
        const tmp = await Promise.all(ownerMusicIdList.map(async (val) => {
            let id = val.toNumber();
            let musicInfo = await musicVault.musicId2MusicMapping(id);
            return musicInfo;
        }));
        setMusicList(tmp);
    }

    const createFanNFT = async function() {

        console.log("creating NFT");

        if (fanNFT != ethers.constants.AddressZero){
            console.log("already created ...");
            return;
        }

        try{
            await(await musicVault.connect(signer).createFanNFT(account.slice(-4)+"-BNBFAN")).wait();
            
            let accForWeb3mq = await signer.getAddress();
            if (instance == undefined){
                await login({"account":accForWeb3mq,"signer":signer});
            }

            let channel;

            instance.once("channel.getList",async (props)=>{
                console.log("get")
                const { channelList} = instance.channel;
                channel = channelList[0];
                console.log(channel);
                console.log("set fanchat id",channel.chatid);
                await (await musicVault.connect(signer).setFanChatId(channel.chatid)).wait();
                refresh();
            });

            await instance.channel.createRoom({
                group_name: account.slice(-4)+"-FanGroup",
                permissions: {
                    "group:join": {
                        type: "enum",
                        value: "public"
                    }
                }
            })

            await instance.channel.queryChannels({
                page: 1, size: 20
            });

            setOpenS(true);
            console.log("Success");
            }catch { 
                setOpenE(true);
                console.log("Failure");
            }
    }

    const createMusic = async function(params) {
        console.log("creating music");  
        try{

            const uploadMusicRes = await uploadFile(params.musicFile);         
            console.log(uploadMusicRes);   
            let data = {
                "name": params.musicName,
                "description": params.musicDescription,
                "image": "ipfs://bafybeigecfa5qopre7crfpa24ppasjvtlgbayxww37e2w3b342zz4gl46u/music.jpg",
                "attributes": [
                    {
                      "trait_type": "musicCid", 
                      "value": uploadMusicRes.cid
                    }]
                }
            const uploadJsonRes = await uploadJson(data);
            
            vaultToken = getVaultToken(provider);
            console.log(await vaultToken.balanceOf(account).toString());
            await (await vaultToken.connect(signer).approve(musicVault.address,CREATE_BASE_FEE)).wait();

            console.log(params.musicName,
                params.musicDescription,
                uploadMusicRes.cid,
                ethers.utils.parseUnits(params.musicPrice, "ether").toString(),
                uploadJsonRes.url)

            await (await musicVault.connect(signer).uploadMusic(
                params.musicName,
                params.musicDescription,
                uploadMusicRes.cid,
                ethers.utils.parseUnits(params.musicPrice, "ether").toString(),
                uploadJsonRes.url
            )).wait();

            setOpenS(true);
            console.log("Success");
        }catch {
            setOpenE(true);
            console.log("Failure");
        }
        setOpenDialog(false);
        refresh();
    }

    const refresh = () => {
        console.log("refreshing ...");
        setTimeout(() => {
            setRender(1-render);
        },9000);
    }


    return(
        <>
        <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6 lg:px-8 h-full">
            <div className="sm:flex sm:flex-col sm:align-center sm:grid sm:grid-cols-2 sm:gap-6 xl:grid-cols-2 lg:mx-auto">
                <Button 
                    onClick={()=>{
                        // router.push("/upload")
                        setOpenDialog(true);
                    }}
                    >
                    Create Music
                </Button>
                <Button onClick={createFanNFT}>
                    {
                        (fanNFT == '0x0000000000000000000000000000000000000000')
                        ? "Create FanClub"
                        : "FanClub "+fanNFT.slice(-4)
                    }
                </Button>
            </div>
            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-5">
                <StatisticCard data={{
                                        "name":"Music Num",
                                        "description":"The number of music uploaded",
                                        "number":ownedMusic
                                    }} />
                <StatisticCard data={{
                                        "name":"Total Sell",
                                        "description":"Total copy of music sold ",
                                        "number":totalPurchases
                                    }} />
                <StatisticCard data={{
                                        "name":"Revenue",
                                        "description":"Token received from purchase ",
                                        "number":totalTokenReceived
                                    }} />
                <StatisticCard data={{
                                        "name":"Votes",
                                        "description":"Total votes received from purchase",
                                        "number":totalVotes
                                    }} />
                <StatisticCard data={{
                                        "name":"Fan Number",
                                        "description":"Total number of Fans",
                                        "number":totalFanNumber
                                    }} />                                                                                                                       
            </div>

            <div className="w-full space-y-4 sm:mt-16 sm:space-y-0  overflow-y-auto max-h-[220px] min-h-[220px]">
                <table className="w-full border-separate border border-slate-400">
                    <thead>
                        <tr>
                            <th className="border border-slate-300 w-1/6 py-4">Id</th>
                            <th className="border border-slate-300 w-2/6 py-4">Name</th>
                            <th className="border border-slate-300 w-1/6 py-4">Purchases</th>
                            <th className="border border-slate-300 w-1/6 py-4">Votes</th>
                            <th className="border border-slate-300 w-1/6 py-4">Revenues</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            musicList.map((music) => {
                                return (
                                    <tr key={music.musicId.toNumber()}>
                                        <td className="border border-slate-300 text-center py-2">
                                            {music.musicId.toNumber()}
                                        </td>
                                        <td className="border border-slate-300 text-center py-2">
                                            {music.musicName}
                                        </td>
                                        <td className="border border-slate-300 text-center py-2">
                                            {music.purchaseAmount.toNumber()}
                                        </td>      
                                        <td className="border border-slate-300 text-center py-2">
                                            {music.voteAmount.toNumber()}
                                        </td>      
                                        <td className="border border-slate-300 text-center py-2">
                                            {ethers.utils.formatUnits((music.purchaseRevenue.add(music.voteRevenue)).toString(), "ether")}
                                        </td>                                     
                                    </tr>  
                                )
                            })
                        }                                                                                                                                                                                     
                    </tbody>
                </table>
            </div>

            <Snackbar open={openS} autoHideDuration={6000} onClose={()=>{setOpenE(false)}}>
                <Alert onClose={()=>{setOpenS(false)}} severity="success" sx={{ width: '100%' }}>
                    Operation Success
                </Alert>
            </Snackbar>
            <Snackbar open={openE} autoHideDuration={6000} onClose={()=>{setOpenE(false)}}>
                <Alert onClose={()=>{setOpenE(false)}} severity="error" sx={{ width: '100%' }}>
                    Operation Failure 
                </Alert>
            </Snackbar>
        </div>      

        <div className={openDialog?"fixed inset-20 z-10 overflow-y-auto":"invisible h-0"}>
            <UploadForm  cbs = {{
                "close" : ()=>{setOpenDialog(false)},
                "upload" : createMusic
            }}
            />
        </div>

        </>

    )

}