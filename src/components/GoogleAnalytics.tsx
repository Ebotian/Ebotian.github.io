'use client';

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (command: string, ...args: any[]) => void;
  }
}

export default function GoogleAnalytics({GA_MEASUREMENT_ID} : {GA_MEASUREMENT_ID : string}){
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (pathname) {
            const url = pathname + searchParams.toString()
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: url,
            })
        }
    }, [pathname, searchParams, GA_MEASUREMENT_ID])

    return (
        <>
            <Script strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}/>
            <Script id='google-analytics' strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA_MEASUREMENT_ID}');
                `,
                }}
            />
        </>
    )
}