import Layout from "@/components/Layout"
import MusicBox from "@/components/MusicBox"
import CollectionDashboard from "@/components/CollectionDashboard"

export default function Collections() {

  return (
    <Layout>
      <section className="bg-black min-h-screen">
        <div className="flex bg-black text-white space-x-4 xl:grid-cols-4">
          <div className="flex-grow-0 flex-shrink-0 w-1/4 border border-dashed border-white"> 
              <MusicBox url="collection"/>
          </div>
          <div className="flex-grow flex-shrink w-3/4 border border-dashed border-white">
              <CollectionDashboard />
          </div>
        </div>
      </section>
    </Layout>
  )
}
