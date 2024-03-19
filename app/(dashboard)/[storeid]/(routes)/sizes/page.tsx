import { format } from "date-fns"
import prismadb from "@/lib/prismadb"

import { SizesClient } from "./components/client"
import { SizeColumn } from "./components/columns"

export default async function SizesPage({
  params
}: {
  params: { storeid: string }
}) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeid
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className=" flex-1 pt-6 p-8 space-y-4">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  )
}
