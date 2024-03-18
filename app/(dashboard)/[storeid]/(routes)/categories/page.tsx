import { format } from "date-fns"
import prismadb from "@/lib/prismadb"

import { CategoryClient } from "./components/client"
import { CategoryColumn } from "./components/columns"

export default async function CategoriesPage({
  params
}: {
  params: { storeid: string }
}) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeid
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className=" flex-1 pt-6 p-8 space-y-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}
