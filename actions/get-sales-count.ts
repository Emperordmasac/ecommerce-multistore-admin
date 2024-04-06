import prismadb from '@/lib/prismadb'

export async function getSalesCount(storeid: string) {
  const salesCount = await prismadb.order.count({
    where: {
      storeId: storeid,
      isPaid: true,
    },
  })

  return salesCount
}
