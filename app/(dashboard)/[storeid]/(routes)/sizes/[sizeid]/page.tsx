import prismadb from "@/lib/prismadb"

import { SizeForm } from "./components/size-form"

export default async function SizePage({
  params
}: {
  params: { sizeid: string }
}) {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeid
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  )
}
