import prismadb from "@/lib/prismadb"

import { ColorForm } from "./components/color-form"

export default async function ColorPage({
  params
}: {
  params: { colorid: string }
}) {
  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorid
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}
