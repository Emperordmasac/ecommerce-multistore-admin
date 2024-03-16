"use client"

import * as z from "zod"
import { useState } from "react"
import { Trash } from "lucide-react"
import { Store } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

interface SettingsFormProps {
  initialData: Store
}

// store settings form schema
const formSchema = z.object({
  name: z.string().min(1)
})

type settingsFormValues = z.infer<typeof formSchema>

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<settingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (values: settingsFormValues) => {
    console.log("🚀 ~ onSubnit ~ values:", values)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manaage your store preferences"
        />
        <Button
          disabled={isLoading}
          variant="destructive"
          size="sm"
          onClick={() => {}}
        >
          <Trash className="w-4 h-4" />
        </Button>
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
                      disabled={isLoading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  )
}
