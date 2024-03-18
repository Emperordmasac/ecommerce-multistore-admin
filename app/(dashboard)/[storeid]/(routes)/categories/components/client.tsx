"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { CategoryColumn, columns } from "./columns"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { ApiList } from "@/components/ui/api-list"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

interface CategoryClientProps {
  data: CategoryColumn[]
}

export function CategoryClient({ data }: CategoryClientProps) {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeid}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryid" />
    </>
  )
}
