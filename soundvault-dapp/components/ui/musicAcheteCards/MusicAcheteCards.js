import { useState } from "react";

export default function MusicAcheteCards({music,credit,cbs}){

    const id = music.musicId.toString();

    const [purchaseNumber,setPurchaseNumber] = useState(0);
    const [purchaseTokenAmount,setPurchaseTokenAmount] = useState("0");
    const [voteNumber,setVoteNumber] = useState(0);
    const [voteTokenAmount,setVoteTokenAmount] = useState("0");



    const purchaseSlideChange = async (e) => {
        const value = e.target.value;
        setPurchaseNumber(value);
        const fee = await cbs.getPurchaseFee(music.musicId,value);
        setPurchaseTokenAmount(fee.toString());
    }

    const voteSlideChange = async (e) => {
        const value = e.target.value;
        setVoteNumber(value);
        const fee = await cbs.getVoteFee(value);
        setVoteTokenAmount(fee.toString());
    }

    const purchase = async () => {
        await cbs.purchase(id,purchaseNumber);
    }

    const vote = async () => {
        await cbs.vote(id,voteNumber);
    }

    return(
        <div className="flex rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900">
            <div className='w-1/2 flex flex-col items-center justify-around'>
                <div className="p-6">
                    <h2 className="text-2xl leading-6 font-semibold text-white">
                        {music.musicName}
                    </h2>
                    <p className="mt-4 text-zinc-300">{music.musicDescription}</p>
                    <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center">
                        <span className="text-xl font-extrabold white mr-4">
                            {music.author.slice(-4)}
                        </span>
                        {
                            (!music.isFan) ?
                            (
                                <button className="text-gray-400 hover:text-white focus:outline-none">
                                follow
                                </button>
                            ) :
                            (
                                <p className="text-gray-400 hover:text-white focus:outline-none">
                                followed
                                </p>
                            )
                        }

                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-around">
                        {
                            (!music.bought)?
                            (
                                <div className="w-full flex flex-row items-center justify-around">
                                    <input type="range" min="0" max={credit} defaultValue="0" className="w-1/2 mr-2" onChange={purchaseSlideChange}/>
                                    
                                    <div className="w-full flex flex-col items-center justify-around">

                                        <button id={"purchaseButton"+id} className="text-gray-400 hover:text-white focus:outline-none" 
                                            onClick={purchase}>
                                            {"Purchase "+purchaseNumber}
                                        </button>
                                        <p id={"purchaseToken"+id}> 
                                            {"Est "+ purchaseTokenAmount + "Tokens"}
                                        </p>
                                    </div>
                                </div>
                            ): (
                                <h2 className="text-2xl font-bold text-white mb-4">Bought</h2>
                            )
                        }

                        {
                            (!music.voted)?
                            (
                            <div className="w-full flex flex-row items-center justify-around">
                                <input type="range" min="1" max={credit} defaultValue="1" className="w-1/2 mr-2" onChange={voteSlideChange}/>
                                <div className="w-full flex flex-col items-center justify-around">
                                    <button id={"voteButton"+id} className="text-gray-400 hover:text-white focus:outline-none" 
                                        onClick={vote}>
                                        {"Vote "+voteNumber}
                                    </button>
                                    <p id={"voteToken"+id}> 
                                        {"Est "+ voteTokenAmount + "Tokens"}
                                    </p>
                                </div>
                            </div>
                            ) : (
                                <h2 className="text-2xl font-bold text-white mb-4">Voted</h2> 
                            )
                        }


            </div>
        </div>
    )
}

