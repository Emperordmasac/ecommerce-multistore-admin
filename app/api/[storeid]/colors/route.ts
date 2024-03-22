import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function POST(
  req: Request,
  { params }: { params: { storeid: string } },
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, value } = body

    if (!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Color value is required', { status: 400 })
    }

    if (!params.storeid) {
      return new NextResponse('Color ID is required', { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeid,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('UnAuthorized', { status: 403 })
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeid,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[COLOR_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeid: string } },
) {
  try {
    if (!params.storeid) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const color = await prismadb.color.findMany({
      where: {
        storeId: params.storeid,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[COLOR_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
