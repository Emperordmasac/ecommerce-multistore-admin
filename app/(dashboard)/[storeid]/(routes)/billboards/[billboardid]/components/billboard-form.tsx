"use client"

import axios from "axios"
import * as z from "zod"
import { useState } from "react"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"
import { Billboard } from "@prisma/client"
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

// billboard  form schema
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

interface BillboardFormProps {
  initialData: Billboard | null
}

type BillboardFormValues = z.infer<typeof formSchema>

export function BillboardForm({ initialData }: BillboardFormProps) {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit billboard" : "Create Billboard"
  const description = initialData ? "Edit a billboard" : "Add a new billboard"
  const toastMessage = initialData
    ? "Billboard updated successfully"
    : "Billboard created successfully"
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: ""
    }
  })

  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeid}/billboards/${params.billboardid}`,
          values
        )
      } else {
        await axios.post(`/api/${params.storeid}/billboards`, values)
      }
      router.refresh()
      router.push(`/${params.storeid}/billboards`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("somthing went wrong, Try again!")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(
        `/api/${params.storeid}/billboards/${params.billboardid}`
      )
      router.refresh()
      router.push("/")
      toast.success("Billboard deleted Successfully")
    } catch (error) {
      toast.error(
        "Make sure you removed all categories using this billboard first"
      )
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
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
      <Separator />
    </>
  )
}
