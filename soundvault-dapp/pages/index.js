import Layout from "@/components/Layout"
import { useAccount } from "@particle-network/connect-react-ui";
import Button from "@/components/ui/Button/Button";

export default function Home() {

  const account = useAccount();  // get User Info in the hook

  const test = function() {
    console.log(account);
  }

  return (
    <>
      <Layout>
        <Button onClick={test}>Test</Button>
      </Layout>
    </>
  )
}
