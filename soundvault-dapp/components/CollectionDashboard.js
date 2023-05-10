import { useAccount,useParticleProvider} from "@particle-network/connect-react-ui";
import getMusicVault from "@/libs/musicVault";
import { ethers } from 'ethers';

import { useState , useEffect} from 'react';
import StatisticCard from './ui/StatisticCard/StatisticCard';
import MusicAcheteCards from "./ui/musicAcheteCards/MusicAcheteCards";

export default function CollectionDashboard(){

    // const account = useAccount();  // get User Info in the hook

    // let provider = undefined;
    // let signer = undefined;
    // let musicVault = undefined;
    // if (account != undefined && account != ""){
    //     const web3provider = useParticleProvider();
    //     provider = new ethers.providers.Web3Provider(web3provider);
    //     musicVault = getMusicVault(provider);
    //     signer = provider.getSigner();
    // }

    let account;
    let provider;
    let musicVault;
    let signer;

    // useEffect(() => {
    //     async function fetchDataAsync() {
    //         if (provider != undefined) {
    //             await fetchData();
    //         }
    //     }
    //     fetchDataAsync();
    // }, [account]);


    const [purchasedNumber, setPurchasedNumber] = useState(-1);
    const [purchaseAmount, setPurchaseAmount] = useState(-1);
    const [voteAmount, setVoteAmount] = useState(-1);
    const [totalTokenExpenses,setTotalTokenExpenses] = useState(-1);
    const [musicList,setMusicList] = useState([]);


    useEffect(() => {
        async function fetchDataAsync() {
            console.log("ether ",window.ethereum);
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            signer = provider.getSigner();
            account = await signer.getAddress();
            musicVault = getMusicVault(provider);
            await fetchData();
            }
        fetchDataAsync();
    }, []);

    const fetchData = async function() {
        console.log("fetching data for user profile");
        setPurchasedNumber(1);
        setPurchaseAmount(1);
        setVoteAmount(1);
        setTotalTokenExpenses(1);
        const list = await musicVault.getBuyerMusicIdList(account);
        console.log(list);
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
        let musicSellInfo = await musicVault.musicId2MusicSellInfoMapping(id);
        let music = {...musicInfo, ...musicSellInfo};

        music.isFan = false;
        music.bought = (await musicVault.musicId2BuyerAmountMapping(id,account)).toNumber();
        music.voted =  (await musicVault.musicId2BuyerVoteAmountMapping(id,account)).toNumber();

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
        provider = new ethers.providers.Web3Provider(window.ethereum);
        musicVault = getMusicVault(provider);
        vaultToken = getVaultToken(provider);
        signer = provider.getSigner();


        const tokenAmount = (await musicVault.calculatePurchaseFee(id,amount)).toString();
        await vaultToken.connect(signer).approve(musicVault.address,tokenAmount);
        await musicVault.connect(signer).purchaseMusic(id,amount);
        console.log("purchase music");
    }

    const vote = async (id,amount) => {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        musicVault = getMusicVault(provider);
        vaultToken = getVaultToken(provider);
        signer = provider.getSigner();


        const tokenAmount = (await musicVault.calculateVoteFee(amount)).toString();
        await vaultToken.connect(signer).approve(musicVault.address,tokenAmount);
        await musicVault.connect(signer).voteMusic(id,amount);
        console.log("vote music");
    }

    return(
        <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-6 lg:px-8 h-full">
            <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
                        Collection Statistics
            </p>
            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
                <StatisticCard data={{
                                        "name":"Collection Num",
                                        "description":"The number of music collections purchased",
                                        "number":purchasedNumber
                                    }} />
                <StatisticCard data={{
                                        "name":"Puchased Copy",
                                        "description":"The total number of copy of music purchased",
                                        "number":purchaseAmount
                                    }} />
                <StatisticCard data={{
                                        "name":"Votes",
                                        "description":"The toal number of votes for music purchased",
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
                
                <div className="mt-12 space-y-4 p-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2 overflow-y-auto">
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
                                    "vote" : vote
                                }} />
                            )
                        })
                    } 

                </div>
            </div>
    )

}