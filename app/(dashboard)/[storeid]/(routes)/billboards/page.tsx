import { BillboardClient } from "./components/client"

export default function BillboardsPage() {
  return (
    <div className="flex-col">
      <div className=" flex-1 pt-6 p-8 space-y-4">
        <BillboardClient />
      </div>
    </div>
  )
}
