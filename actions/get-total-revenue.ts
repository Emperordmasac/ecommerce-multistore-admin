import prismadb from '@/lib/prismadb'

export async function getTotalRevenue(storeid: string) {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId: storeid,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price
    }, 0)

    return total + orderTotal
  }, 0)

  return totalRevenue
}
