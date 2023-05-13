import { useAccount,useParticleProvider} from "@particle-network/connect-react-ui";
import getMusicVault from "@/libs/musicVault";
import { ethers } from 'ethers';
import getVaultToken from "@/libs/vaultToken";
import { useState , useEffect} from 'react';
import StatisticCard from './ui/StatisticCard/StatisticCard';
import MusicAcheteCards from "./ui/musicAcheteCards/MusicAcheteCards";
import { instance, login } from "@/libs/web3mq";

export default function CollectionDashboard(){

    const account = useAccount(); 
    let provider = undefined;
    let musicVault = undefined;
    let vaultToken = undefined;
    let signer = undefined;

    const [purchasedNumber, setPurchasedNumber] = useState(-1);
    const [voteAmount, setVoteAmount] = useState(-1);
    const [totalTokenExpenses,setTotalTokenExpenses] = useState(-1);
    const [musicList,setMusicList] = useState([]);
    const [render,setRender] = useState(0);

    if (account != undefined && account != ""){
        const web3provider = useParticleProvider();
        provider = new ethers.providers.Web3Provider(web3provider);
        musicVault = getMusicVault(provider);
        vaultToken = getVaultToken(provider);
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

    useEffect(() => {
        async function fetchDataAsync() {
                if (provider != undefined) {
                    await fetchData();
                }
            }
        fetchDataAsync();
    }, [render]);

    const fetchData = async function() {
        console.log("fetching data for user profile");
        console.log(musicVault);
        const user = await musicVault.address2UserMapping(account);
        setPurchasedNumber(user.purchase.toNumber());
        setVoteAmount(user.vote.toNumber());
        setTotalTokenExpenses(ethers.utils.formatUnits(user.totalExpense,"ether"));
        const list = await musicVault.getCollectorMusicIdList(account);
        setMusicList(await Promise.all(list.map(getMusicByIdInDetail)));
    }

    const getMusicByIdInDetail = async (val) => {
        console.log(val);
        let id;

        // @todo optimize
        if ((typeof val)!='number'){
            id = val.toNumber();
        }else{
            id = val;
        }

        let musicInfo = await musicVault.musicId2MusicMapping(id);

        let music = {...musicInfo};

        music.canBeFollowed = await musicVault.canBeFollowed(music.author);
        music.isFollower = await musicVault.isFollower(music.author,account);
        // music.isFollower = false;
        music.bought = (await musicVault.musicId2CollectorAmountMapping(id,account)).toNumber();
        music.voted =  (await musicVault.musicId2CollectorVoteAmountMapping(id,account)).toNumber();

        console.log(music);
        return music;
    }

    const getPurchaseFee = async (id,amount) => {
        // to be commented
        provider = new ethers.providers.Web3Provider(window.ethereum);
        musicVault = getMusicVault(provider);

        const tmp = (await musicVault.calculatePurchaseFee(id,amount));
        const val = ethers.utils.formatUnits(tmp,"ether");
        return val;
    }

    const getVoteFee = async (amount) => {
        // to be commented
        provider = new ethers.providers.Web3Provider(window.ethereum);
        musicVault = getMusicVault(provider);

        const tmp = (await musicVault.calculateVoteFee(amount));
        const val = ethers.utils.formatUnits(tmp,"ether");
        return val;
    }

    const purchase = async (id,amount) => {
        const tokenAmount = (await musicVault.calculatePurchaseFee(id,amount)).toString();
        await (await vaultToken.connect(signer).approve(musicVault.address,tokenAmount)).wait();
        await (await musicVault.connect(signer).purchaseMusic(id,amount)).wait();
        console.log("purchase music");
    }

    const vote = async (id,amount) => {
        const tokenAmount = (await musicVault.calculateVoteFee(amount)).toString();
        await (await vaultToken.connect(signer).approve(musicVault.address,tokenAmount)).wait();
        await (await musicVault.connect(signer).voteMusic(id,amount)).wait();
        console.log("vote music");
        refresh();
    }

    const follow = async (author) => {
        await musicVault.connect(signer).followMusician(author);
        if (instance == undefined){
            let accForWeb3mq = await signer.getAddress();
            await login({"account":accForWeb3mq,"signer":signer});
        }
        const chatid = (await musicVault.address2UserMapping(author)).chatId;
        console.log(chatid);
        await instance.channel.joinGroup(chatid);
        refresh();
    }

    const refresh = () => {
        console.log("refreshing ...");
        setTimeout(() => {
            setRender(1-render);
        },3000);
    }


    return(
        <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6 lg:px-8 h-full">
            <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
                        Collection Statistics
            </p>
            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                <StatisticCard data={{
                                        "name":"Collection Num",
                                        "description":"The number of music collections collected",
                                        "number":purchasedNumber
                                    }} />
                <StatisticCard data={{
                                        "name":"Votes",
                                        "description":"The toal number of votes for music collected",
                                        "number":voteAmount
                                    }} />
                <StatisticCard data={{
                                        "name":"Expenses",
                                        "description":"Total number of tokens expended in MusicVault",
                                        "number":totalTokenExpenses
                                    }} />                                                                                                                       
            </div>

                <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
                    Collections   
                </p>
                
                <div className=" h-[200px] mt-12 space-y-4 p-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2 overflow-y-auto">
                    {
                        musicList.map((music) => {
                            return(
                                <MusicAcheteCards 
                                music={music} 
                                credit = {0}
                                cbs={{
                                    "getPurchaseFee" : getPurchaseFee,
                                    "getVoteFee" : getVoteFee,
                                    "purchase" : purchase,
                                    "vote" : vote,
                                    "follow" : follow,
                                }} />
                            )
                        })
                    } 

                </div>
            </div>
    )

}