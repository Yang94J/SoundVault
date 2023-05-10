import { useState , useEffect} from 'react';
import { useAccount,useParticleProvider} from "@particle-network/connect-react-ui";
import getMusicVault from "@/libs/musicVault";
import { ethers } from 'ethers';

import StatisticCard from './ui/StatisticCard/StatisticCard';

export default function Dashboard(){

    // Comment for test use
    // const account = useAccount();  // get User Info in the hook
    // let provider = undefined;
    // let musicVault = undefined;
    // if (account != undefined && account != ""){
    //     const web3provider = useParticleProvider();
    //     provider = new ethers.providers.Web3Provider(web3provider);
    //     musicVault = getMusicVault(provider);
    // }

    let account;
    let provider;
    let musicVault;
    let signer;

    const [musicNumber, setMusicNumber] = useState(-1);
    const [userNumber, setUserNumber] = useState(-1);
    const [purchases, setPurchases] = useState(-1);
    const [purchaseAmount, setPurchaseAmount] = useState(-1);

    // useEffect(() => {
    //     async function fetchDataAsync() {
    //         if (provider != undefined) {
    //             await fetchData();
    //         }
    //     }
    //     fetchDataAsync();
    // }, [account]);

    useEffect(() => {
        async function fetchDataAsync() {
            console.log("ether ",window.ethereum);
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            signer = provider.getSigner();
            account = await signer.getAddress();
            musicVault = getMusicVault(provider);
            console.log(account);
            await fetchData();
            }
        fetchDataAsync();
    }, []);

    const fetchData = async function () {
        console.log("fetching data from blockchain");
        setMusicNumber((await musicVault.musicNumber()).toNumber());
        setUserNumber((await musicVault.userNumber()).toNumber());
        setPurchases((await musicVault.purchaseNumer()).toNumber()); //@todo
        setPurchaseAmount(ethers.utils.formatUnits(await musicVault.purchaseTokenAmount(),"ether"));
        console.log("fetching complete");
    };


    return (
        <section className="bg-black max-h-[767px] min-h-[767px]">
            <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:flex-col sm:align-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
                        MusicVault
                    </h1>
                    <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
                        We are built on the principles of decentralization 
                        and
                        empowers musicians to share their creativity with the world..
                    </p>
                    <div className="relative self-center mt-6 text-xl text-zinc-200 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
                        Our achievements
                    </div>
                </div>
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">

                    <StatisticCard data={{
                                            "name":"Music Number",
                                            "description":"Number of music uploaded onto the platform",
                                            "number":musicNumber
                                        }} />
                    <StatisticCard data={{
                                            "name":"User Number",
                                            "description":"Number of users get interacted with musicvault",
                                            "number":userNumber
                                        }} />
                    <StatisticCard data={{
                                            "name":"Purchase",
                                            "description":"Number of music copies purchased by users",
                                            "number":purchases
                                        }} />
                    <StatisticCard data={{
                                            "name":"Turnover",
                                            "description":"Total number of tokens made via purchase",
                                            "number":purchaseAmount
                                        }} />
                </div>                                 
            </div>
        </section>
    )

}