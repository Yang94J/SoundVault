export default function MusicAcheteCards({music,cbs}){
    return(
        <div className="flex rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900">
            <div className='w-1/2'>
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
                        <button className="text-gray-400 hover:text-white focus:outline-none">
                            follow
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-around">
                <div className="w-full flex flex-row items-center justify-around">
                    <input type="range" min="1" max="10" defaultValue="1" className="w-2/3 mr-2" />
                    <button className="text-gray-400 hover:text-white focus:outline-none" >
                    Buy 2   
                    </button>
                </div>
                <div className="w-full flex flex-row items-center justify-around">
                    <input type="range" min="1" max="10" defaultValue="1" className="w-2/3 mr-2" />
                    <button className="text-gray-400 hover:text-white focus:outline-none" >
                    Vote
                    </button>
                </div>
            </div>
        </div>
    )
}

