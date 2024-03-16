import prismadb from "@/lib/prismadb"

interface DashboardPageProps {
  params: { storeid: string }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeid
    }
  })

  return <div>Active store: {store?.name}</div>
}
