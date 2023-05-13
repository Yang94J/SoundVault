import Dialog from '@/components/icons/DIalog';
import { useState , useEffect} from 'react';

export default function Chatbar({list,cbs}) {

    const clickChat = async (ind) => {
        console.log(ind);
        cbs.clickChat(ind);
    }


    return (

            <div className="dark flex-shrink-0 overflow-x-hidden bg-black">
              <div className="h-full w-[260px]">
                <div className="flex h-full min-h-0 flex-col ">
                  <div className="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20">
                    <nav className="flex h-full w-full flex-col p-2">
                        <div className='flex-col flex-1 transition-opacity duration-500 overflow-y-auto max-h-[700px] min-h-[700px]'>
                            <div className='flex flex-col gap-2 pb-2 text-gray-100 text-sm'>
                                <span>
                                    <div className="relative" style={{"height": "auto", "opacity": 1}}>
                                        <div className='sticky top-0 z-[14]' style={{"opacity": 1}}>
                                            <div className="h-9 pb-2 pt-3 px-3 text-xs text-white font-medium text-ellipsis overflow-hidden break-all bg-black">
                                                Fanclub
                                            </div>
                                            <ol>
                                                {
                                                    list.map((channel,index)=>{
                                                        return(
                                                            <li key={index} className='relative' style={{opacity: 1, height: "auto"}}>
                                                                <button className='w-full flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all )} )} hover:pr-4 bg-black group'
                                                                    onClick={()=>{clickChat(index)}}
                                                                >
                                                                    <Dialog />
                                                                    <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
                                                                        {channel.chat_name}
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ol>
                                        </div>
                                    </div> 
                                </span>
                            </div>
                        </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

    )
    
}