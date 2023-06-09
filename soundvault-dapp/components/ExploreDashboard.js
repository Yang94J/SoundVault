import { useState , useEffect} from 'react';
import { useAccount,useParticleProvider} from "@particle-network/connect-react-ui";
import getMusicVault from "@/libs/musicVault";
import getVaultToken from '@/libs/vaultToken';
import { ethers } from 'ethers';
import StatisticCard from './ui/StatisticCard/StatisticCard';
import LeaderBoard from './ui/LeaderBoard/LeaderBoard';
import MusicAcheteCards from './ui/musicAcheteCards/MusicAcheteCards';
import { instance, login } from '@/libs/web3mq';

export default function ExploreDashboard(){

    const account = useAccount(); 
    let provider = undefined;
    let musicVault = undefined;
    let vaultToken = undefined;
    let signer = undefined;

    const [musicList,setMusicList] = useState([])
    const [purchaseLeaderBoardList,setPurchaseLeaderBoardList] = useState([])
    const [voteLeaderBoardList,setVoteLeaderBoardList] = useState([])
    const [userCredit,setUserCredit] = useState(1);
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
        console.log("refreshing by render");
        fetchDataAsync();
    }, [render]);


    const fetchData = async function() {
        console.log("fetching data for Explore info")
        const purchaseLeaderBoard = await musicVault.getPurchaseLeaderboard();
        setPurchaseLeaderBoardList(await Promise.all(purchaseLeaderBoard.map(getMusicById)));
        const voteLeaderBoard = await musicVault.getVoteLeaderboard();
        setVoteLeaderBoardList(await Promise.all(voteLeaderBoard.map(getMusicById)));
        const musicList = Array.from({ length: (await musicVault.musicNumber()).toNumber() }, (_, index) => index);
        setMusicList(await Promise.all(musicList.map(getMusicByIdInDetail)));
        setUserCredit((await musicVault.getUserCredit(account)).toNumber());
    }

    const getMusicById = async (val) => {
        let id;
        if ((typeof val)!='number'){
            id = val.toNumber();
        }else{
            id = val;
        }
        let musicInfo = await musicVault.musicId2MusicMapping(id);
        return (musicInfo);
    }

    const getMusicByIdInDetail = async (val) => {
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
        // music.isFollower  = false;
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
        refresh();
    }

    const vote = async (id,amount) => {
        const tokenAmount = (await musicVault.calculateVoteFee(amount)).toString();
        await (await vaultToken.connect(signer).approve(musicVault.address,tokenAmount)).wait();
        await (await musicVault.connect(signer).voteMusic(id,amount)).wait();
        console.log("vote music");
        refresh();
    }

    const follow = async (author) => {
        await (await musicVault.connect(signer).followMusician(author)).wait();
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

    return (
        <section className="bg-black min-h-[767px] max-h-[767px]    ">
            <div className="w-full mx-auto py-8 sm:py-8 px-4 sm:px-6 lg:px-8  h-[750px]">   
                <div className="sm:flex sm:flex-col sm:align-center h-full">

                    <div className="flex bg-black text-white space-x-4 xl:grid-cols-4 h-full ">
                        <div className="flex-grow-0 flex-shrink-0 w-1/4 border border-dashed border-white h-full ">
                            <div className="flex flex-col space-y-1 overflow-y-auto">
                                <LeaderBoard name="Purchase" list={purchaseLeaderBoardList} className="h-1/2"/>
                                <LeaderBoard name="Vote" list={voteLeaderBoardList} className="h-1/2"/>
                            </div>
                        </div>
                        <div className="flex-grow flex-shrink w-3/4 border border-dashed border-white h-full ">
                            <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
                                Exploring the world of melody..   
                            </p>
                            
                            <div className="mt-12 space-y-4 p-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2 overflow-y-auto min-h-[400px] max-h-[400px]">
                                {
                                    musicList.map((music) => {
                                        return(
                                            <MusicAcheteCards 
                                            music={music} 
                                            credit = {userCredit}
                                            cbs={{
                                                "getPurchaseFee" : getPurchaseFee,
                                                "getVoteFee" : getVoteFee,
                                                "purchase" : purchase,
                                                "vote" : vote,
                                                "follow" : follow
                                            }} />
                                        )
                                    })
                                } 
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>    
        </section>
    )

}