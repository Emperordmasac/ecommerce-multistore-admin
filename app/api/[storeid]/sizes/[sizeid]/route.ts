import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function GET(
  req: Request,
  { params }: { params: { sizeid: string } },
) {
  try {
    if (!params.sizeid) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeid,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[SIZE_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeid: string; sizeid: string } },
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, value } = body

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Size value is required', { status: 400 })
    }

    if (!params.sizeid) {
      return new NextResponse('Size ID is required', { status: 400 })
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeid,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[Size_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeid: string; sizeid: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 })
    }

    if (!params.sizeid) {
      return new NextResponse('Size ID is required', { status: 400 })
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeid,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[SIZE_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
