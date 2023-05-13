import MusicCard from "./ui/MusicCard/MusicCard";
import getMusicVault from "@/libs/musicVault";
import { ethers } from 'ethers';
import { IPFS_AUDIOPREFIX } from "@/libs/Ipfs";
import { useState , useEffect} from 'react';
import { useAccount,useParticleProvider } from "@particle-network/connect-react-ui";

export default function MusicBox({url}){

    const account = useAccount(); 
    let provider = undefined;
    let musicVault = undefined;
    let vaultToken = undefined;
    let signer = undefined;

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

    const [musicList,setMusicList] = useState([])



    const fetchData = async function() {
        console.log("fetching data for user profile");
        let list;
        console.log(url);
        if (url == "author"){
            list = await musicVault.getOwnerMusicIdList(account);
        }
        if (url == "collection"){
            list = await musicVault.getCollectorMusicIdList(account);
        }
        const tmp = await Promise.all(list.map(async (val) => {
            let id = val.toNumber();
            return (await musicVault.musicId2MusicMapping(id));
        }));
        setMusicList(tmp);
    }

    const switchMusic = (ind) => {
        console.log("ind : ",ind);
        // add additional logic here
        const changeSongName = musicList[ind].musicName;
        document.getElementById("playmusicName").textContent = "Playing "+changeSongName+" ...";
        const cid = musicList[ind].cid;
        console.log(cid);
        const video = document.getElementById("playmusic");
        video.setAttribute("src",IPFS_AUDIOPREFIX+cid);
        video.play();
    }

    return (
        <div className="h-full">
            <div className="h-4/5 w-full mt-16 sm:mt-0 overflow-y-auto">
                <p className="mt-5 p-2 text-3xl font-bold text-gray-800 text-center sm:text-left sm:text-2xl max-w-2xl mx-auto">
                    PlayList
                </p>
                {
                    musicList.map((music,index) => {
                        return (
                            <MusicCard key={index} music={{
                                "name" : music.musicName,
                                "index" : index,
                            }}  
                            cb = {(ind)=>{switchMusic(ind)}}
                            />
                        )
                    })
                }
            </div>
            <div className="h-1/5 p-2 justify-center space-y-4">
                <h4 id="playmusicName" className="text-1xl leading-6 font-semibold text-white">
                    Playing ...
                </h4>
                <audio id="playmusic" src="video.mp4" controls loop controlsList="nodownload"></audio>
            </div>
        </div>
    )
}
