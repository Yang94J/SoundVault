import Layout from "@/components/Layout"
import { useAccount} from "@particle-network/connect-react-ui";


import Dashboard from "@/components/Dashboard";

export default function Home() {

  return (
    <>
      <Layout>
        <Dashboard className="max-h-[767px] min-h-[767px]"/>
      </Layout>
    </>
  )
}
