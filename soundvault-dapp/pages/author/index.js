import Layout from "@/components/Layout"
import Profile from "@/components/AuthorDashboard"
import MusicBox from "@/components/MusicBox"
import { useState } from "react"

export default function Author() {


  return (
    <Layout>
      <section className="bg-black max-h-[767px] min-h-[767px]">
        <div className="flex bg-black text-white space-x-4 xl:grid-cols-4">
          <div className="flex-grow-0 flex-shrink-0 w-1/4 border border-dashed border-white"> 
              <MusicBox url="author"/>
          </div>
          <div className="flex-grow flex-shrink w-3/4 border border-dashed border-white">
              <Profile />
          </div>
        </div>
      </section>
    </Layout>
  )
}
