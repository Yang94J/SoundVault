export default function LeaderBoard({name,list}){
    return(
        <div >
            <div className="h-3/4 w-full space-y-1 sm:mt-16 sm:space-y-0  overflow-y-auto">
                <p className="mt-5 p-2 text-3xl font-bold text-gray-800 text-center sm:text-left sm:text-2xl max-w-2xl mx-auto">
                    {name}
                </p>
                {
                    list.map((music) => {
                        return (
                            <div className="flex items-center justify-between py-2 px-4 bg-black hover:bg-gray-700 transition-colors duration-300">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-white font-semibold">{music.musicName}</p>
                                    </div>                                   
                                    <div className="ml-4">
                                        {/* <p className="text-white font-semibold">id : {music.musicId.toString()}</p> */}
                                        <p className="text-white font-semibold">author : {music.author.slice(-4)}</p>
                                        {/* <p className="text-white font-semibold">musicName</p>
                                        <p className="text-white font-semibold">musicAuthor</p> */}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}