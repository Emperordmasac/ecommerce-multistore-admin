import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"

import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"
import { format } from "date-fns"

export default async function ProductsPage({
  params
}: {
  params: { storeid: string }
}) {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeid
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className=" flex-1 pt-6 p-8 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}
