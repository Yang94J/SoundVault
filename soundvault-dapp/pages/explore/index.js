import Layout from "@/components/Layout"
import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import ExploreDashboard from "@/components/ExploreDashboard";

export default function Home() {

  return (
    <>
      <Layout>
        <ExploreDashboard />
      </Layout>
    </>
  )
}
