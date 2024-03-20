"use client"

import axios from "axios"
import * as z from "zod"
import { useState } from "react"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"
import { Size } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import ImageUpload from "@/components/ui/image-upload"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { AlertModal } from "@/components/modals/alert-modal"

// size  form schema
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
})

interface SizeFormProps {
  initialData: Size | null
}

type SizeFormValues = z.infer<typeof formSchema>

export function SizeForm({ initialData }: SizeFormProps) {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit size" : "Create Size"
  const description = initialData ? "Edit a size" : "Add a new size"
  const toastMessage = initialData
    ? "Size updated successfully"
    : "Size created successfully"
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: ""
    }
  })

  const onSubmit = async (values: SizeFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeid}/sizes/${params.sizeid}`,
          values
        )
      } else {
        await axios.post(`/api/${params.storeid}/sizes`, values)
      }
      router.refresh()
      router.push(`/${params.storeid}/sizes`)
      toast.success(toastMessage)
      router.refresh()
    } catch (error) {
      toast.error("somthing went wrong, Try again!")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeid}/sizes/${params.sizeid}`)
      router.refresh()
      router.push(`/${params.storeid}/sizes`)
      router.refresh()
      toast.success("Size deleted Successfully")
    } catch (error) {
      toast.error("Make sure you removed all products using this size first")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
