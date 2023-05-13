import Chatbar from "./ui/Chatbar/Chatbar";
import DialogWindow from "./ui/DialogWindow/DialogWindow";
import { login, instance } from "@/libs/web3mq";
import { useState , useEffect} from 'react';
import { ethers } from "ethers";
import { useAccount, useParticleProvider } from "@particle-network/connect-react-ui";



export default function FanclubDashboard(){
  const account = useAccount(); 
  let provider = undefined;
  let signer = undefined;

  if (account != undefined && account != ""){
    const web3provider = useParticleProvider();
    provider = new ethers.providers.Web3Provider(web3provider);
    signer = provider.getSigner();
  }

  const [channelList,setChannelList] = useState([]);
  const [msgList,setMsgList] = useState([]);

  useEffect(() => {
    async function fetchDataAsync() {
      if (provider != undefined) {

        if (instance == undefined){
          console.log("trying to get from init");
          let accForWeb3mq = await signer.getAddress();
          try {
            await login({"account":accForWeb3mq,"signer":signer});
          } catch (error) {
            
          }
        }
  
        instance.on('channel.getList', listenEvent);
        instance.on('channel.activeChange',listenEvent);
        instance.on('message.delivered',listenEvent);
        instance.on('channel.updated',listenEvent);
        instance.on('message.getList',listenEvent);
  
        await instance.channel.queryChannels({
          page: 1,
          size: 20
        });
      }
    }
    fetchDataAsync();
  }, [account]);


  const listenEvent = (props) => {
    if (props.type === 'channel.getList') {
        const { channelList, activeChannel } = instance.channel;
        console.log('your channel list:', channelList)
        setChannelList(channelList);
    }
    if (props.type === ' channel.activeChange'){
      console.log("active channel changed");
    }
    if (props.type === ' message.delivered'){
      console.log("message.delivered");
    }
    if (props.type === 'channel.updated'){
      console.log("channel.updated");
    }
    if (props.type === 'message.getList'){
      console.log("message.getList");
      setMsgList(instance.message.messageList);
    }
  }

  const clickChat = async (ind) => {
    const { channelList, activeChannel } = instance.channel;
    console.log("change active channel")
    console.log('your selected channel is ', channelList[ind]);
    instance.channel.setActiveChannel(channelList[ind]);
    await await instance.message.getMessageList({
        page: 1, size: 20
      });
  }
  
  const sendMsg = async (msg) => {
    instance.message.sendMessage(msg);
    await await instance.message.getMessageList({
      page: 1, size: 20
    });    
  }


    return(
        <div className="overflow-auto w-full h-full relative flex z-0 min-h-[767px] max-h-[767px]">
            <Chatbar list={channelList} cbs={{"clickChat":clickChat}}/>
            <DialogWindow list={msgList} cbs={{"sendMsg":sendMsg}}/>
        </div>
    )

}