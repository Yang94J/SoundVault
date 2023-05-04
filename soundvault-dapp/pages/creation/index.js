import Layout from "@/components/Layout"


export default function Create() {

  return (
    <Layout>
      <section className="bg-black">
        <div className="flex bg-black text-white space-x-4 xl:grid-cols-4 min-h-screen">
          <div className="flex-grow-0 flex-shrink-0 w-1/4 border border-dashed border-white"> 
              PlaceHolder for music list
          </div>
          <div className="flex-grow flex-shrink w-3/4 border border-dashed border-white">
              Placeholder for user profile and some buttons
          </div>
        </div>
      </section>
    </Layout>
  )
}
