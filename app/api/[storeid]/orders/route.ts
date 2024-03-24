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

    const { label, imageUrl } = body

    if (!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 })
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 })
    }

    if (!params.storeid) {
      return new NextResponse('Store ID is required', { status: 400 })
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeid,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[BILLBOARD_POST]', error)
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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeid,
      },
    })

    return NextResponse.json(billboards)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
