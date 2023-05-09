import Send from '@/components/icons/Send';
import User from '@/components/icons/User';
import { useState , useEffect} from 'react';

export default function DialogWindow({list,cbs}) {

    console.log(list);

    const sendMsg = async () => {
        const msg = document.getElementById("userinput").value;
        document.getElementById("userinput").value="";
        await cbs.sendMsg(msg);
    } 

    return (
        <div className='relative flex h-full max-w-full flex-1 overflow-y-auto '>
            <div className='flex h-full max-w-full flex-1 flex-col overflow-hidden'>
                <main className='relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
                    <div className='flex-1 overflow-hidden overflow-y-auto max-h-[700px] min-h-[700px]'>
                        <div className='h-full dark:bg-gray-800'> 
                        <div className=''>
                        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
                            {
                                list.map((chat) => {
                                    return (
                                        <div className='group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800'>
                                            <div className='flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl md:py-6 lg:px-0 m-auto'>
                                                <div className='flex-shrink-0 flex flex-col relative items-end'>
                                                    <div className='w-[50px] relative flex'>
                                                        <span style={
                                                            {"box-sizing": "border-box", "display": "inline-block", "overflow": "hidden", "width": "initial", "height": "initial",
                                                            "background": "none", "opacity": 1, "border": "0px", "margin":"0px", "padding":"0px","position": "relative", "max-width": "100%"}}>
                                                                <User />
                                                                {chat.senderId.slice(-5)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='relative flex flex-col w-[calc(100%-50px)] gap-1 md:gap-3 lg:w-[calc(100%-115px)]'>
                                                    <div className='flex flex-grow flex-col gap-3'>
                                                        <p>
                                                            {chat.date + "  " + chat.timestamp}
                                                        </p>
                                                        <div className='min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap break-words'>
                                                            {chat.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        </div>
                        </div>
                    </div>
                    <div className='bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2'>
                        <div className='stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
                            <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
                                <div className='flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'>
                                    <textarea id='userinput' className='m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0 focus:outline-none '
                                        placeholder='Send messages' style={{"height" : "60px", "overflow": "auto"}}
                                        >
                                    </textarea>
                                    <button className='absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40'
                                        onClick={sendMsg}>
                                        <Send />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}