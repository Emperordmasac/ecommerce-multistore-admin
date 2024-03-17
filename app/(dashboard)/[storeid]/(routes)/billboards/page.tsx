import prismadb from "@/lib/prismadb"

import { BillboardClient } from "./components/client"

export default async function BillboardsPage({
  params
}: {
  params: { storeid: string }
}) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeid
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="flex-col">
      <div className=" flex-1 pt-6 p-8 space-y-4">
        <BillboardClient data={billboards} />
      </div>
    </div>
  )
}
