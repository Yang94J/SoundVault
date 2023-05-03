import Layout from "@/components/Layout"
import { useAccount,useParticleProvider} from "@particle-network/connect-react-ui";
import { ethers } from "ethers";

import getMusicVault from "@/libs/musicVault";
import Button from "@/components/ui/Button/Button";

export default function Home() {

  const account = useAccount();  // get User Info in the hook
  let provider;
  let musicVault;
  if (account != undefined){
    const web3provider = useParticleProvider();
    provider = new ethers.providers.Web3Provider(web3provider);
    musicVault = getMusicVault(provider);
  }

  const test = async function(){
    console.log(account)
    console.log(provider)
    console.log(await provider.getBalance(account));
    console.log(await musicVault.userNumber());
  }


  return (
    <>
      <Layout>
        <Button onClick={test}>Test</Button>
      </Layout>
    </>
  )
}
