export default function MusicCard({music,cb}){
    return(
            <div className="flex items-center justify-between py-2 px-4 bg-black hover:bg-gray-700 transition-colors duration-300">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                    </div>
                <div className="ml-4">
                    <p className="text-white font-semibold">{music.name}</p>
                </div>
            </div>
            <div>
              <button className="text-gray-400 hover:text-white focus:outline-none"onClick={()=>{cb(music.index)}} >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
    )
}

