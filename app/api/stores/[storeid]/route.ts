import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function PATCH(
  req: Request,
  { params }: { params: { storeid: string } },
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name } = body

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!params.storeid) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeid,
        userId,
      },
      data: {
        name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[STORE_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeid: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 })
    }

    if (!params.storeid) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeid,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[STORE_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
