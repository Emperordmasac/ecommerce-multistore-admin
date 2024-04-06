import prismadb from '@/lib/prismadb'

export async function getStockCount(storeid: string) {
  const stockCount = await prismadb.product.count({
    where: {
      storeId: storeid,
      isArchived: false,
    },
  })

  return stockCount
}
