import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function GET(
  req: Request,
  { params }: { params: { productid: string } },
) {
  try {
    if (!params.productid) {
      return new NextResponse('Product ID is required', { status: 400 })
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productid,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[PRODUCT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeid: string; productid: string } },
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

    if (!params.productid) {
      return new NextResponse('Product ID is required', { status: 400 })
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

    await prismadb.product.update({
      where: {
        id: params.productid,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {},
        },
      },
    })

    const product = await prismadb.product.update({
      where: {
        id: params.productid,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeid: string; productid: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('UnAuthorized', { status: 401 })
    }

    if (!params.productid) {
      return new NextResponse('Product ID is required', { status: 400 })
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productid,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    // TODO: change to a logger in PRODUCTION
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
