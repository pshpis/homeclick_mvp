import type {NextRequest} from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return;
    }

    // console.log(req);

    if (req.nextUrl.locale === 'en') {

        return;
        // return NextResponse.redirect(
        //     new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
        // )
    }
}