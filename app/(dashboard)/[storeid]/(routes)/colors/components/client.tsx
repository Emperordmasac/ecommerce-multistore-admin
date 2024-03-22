"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { ColorColumn, columns } from "./columns"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { ApiList } from "@/components/ui/api-list"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

interface ColorsClientProps {
  data: ColorColumn[]
}

export function ColorsClient({ data }: ColorsClientProps) {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeid}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorid" />
    </>
  )
}
