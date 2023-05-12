import Chatbar from "./ui/Chatbar/Chatbar";
import DialogWindow from "./ui/DialogWindow/DialogWindow";
import { login, instance } from "@/libs/web3mq";
import { useState , useEffect} from 'react';
import { ethers } from "ethers";



export default function FanclubDashboard(){

  const [channelList,setChannelList] = useState([]);
  const [msgList,setMsgList] = useState([]);

  useEffect(() => {
    async function fetchDataAsync() {

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      let signer = provider.getSigner();
      let account = await signer.getAddress();


      if (instance == undefined){
        await login({"account":account,"signer":signer});
      }

      console.log("fetchData");

      instance.on('channel.getList', listenEvent);
      instance.on('channel.activeChange',listenEvent);
      instance.on('message.delivered',listenEvent);
      instance.on('channel.updated',listenEvent);
      instance.on('message.getList',listenEvent);

      await instance.channel.queryChannels({
      });
    }
    fetchDataAsync();
  }, []);


  const listenEvent = (props) => {
    console.log(event)
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