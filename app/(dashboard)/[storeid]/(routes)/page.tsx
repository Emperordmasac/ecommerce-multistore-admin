import prismadb from "@/lib/prismadb"
import { CreditCard, DollarSign, Package } from "lucide-react"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatter } from "@/lib/utils"
import { getTotalRevenue } from "@/actions/get-total-revenue"
import { getSalesCount } from "@/actions/get-sales-count"
import { getStockCount } from "@/actions/get-stock-count copy"
import { Overview } from "@/components/overview"
import { getGraphRevenue } from "@/actions/get-graph-revenue"

interface DashboardPageProps {
  params: { storeid: string }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const totalRevenue = await getTotalRevenue(params.storeid)
  const salesCount = await getSalesCount(params.storeid)
  const stockCount = await getStockCount(params.storeid)
  const graphData = await getGraphRevenue(params.storeid)

  return (
    <div className="flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />

        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className=" text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className=" text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Product In Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className=" text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
