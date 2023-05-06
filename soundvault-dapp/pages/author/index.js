import Layout from "@/components/Layout"
import Profile from "@/components/AuthorDashboard"
import MusicBox from "@/components/MusicBox"

export default function Author() {

  return (
    <Layout>
      <section className="bg-black min-h-screen">
        <div className="flex bg-black text-white space-x-4 xl:grid-cols-4">
          <div className="flex-grow-0 flex-shrink-0 w-1/4 border border-dashed border-white"> 
              <MusicBox />
          </div>
          <div className="flex-grow flex-shrink w-3/4 border border-dashed border-white">
              <Profile />
          </div>
        </div>
      </section>
    </Layout>
  )
}
