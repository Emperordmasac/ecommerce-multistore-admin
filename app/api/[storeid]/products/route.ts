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

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body

    if (!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse('Category Id is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color Id is required', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Size Id is required', { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse('Image is required', { status: 400 })
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        storeId: params.storeid,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[PRODUCT_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeid: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const sizeId = searchParams.get('sizeId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    if (!params.storeid) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const product = await prismadb.product.findMany({
      where: {
        storeId: params.storeid,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[PRODUCT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
