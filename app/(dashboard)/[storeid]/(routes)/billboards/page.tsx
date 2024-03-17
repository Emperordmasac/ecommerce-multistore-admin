import { format } from "date-fns"
import prismadb from "@/lib/prismadb"

import { BillboardClient } from "./components/client"
import { BillboardColumn } from "./components/columns"

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

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className=" flex-1 pt-6 p-8 space-y-4">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}
