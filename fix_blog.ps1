# 创建 GoogleAnalytics.tsx 组件
$googleAnalyticsContent = @"
'use client';

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleAnalytics({GA_MEASUREMENT_ID} : {GA_MEASUREMENT_ID : string}){
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const url = pathname + searchParams.toString()
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        })
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
"@

New-Item -Path "src\components\GoogleAnalytics.tsx" -Value $googleAnalyticsContent -Force

# 修改 layout.tsx
$layoutContent = Get-Content "src\app\layout.tsx" -Raw
if ($layoutContent -notmatch "import GoogleAnalytics") {
    $layoutContent = $layoutContent -replace "export default function RootLayout\({", @"
import GoogleAnalytics from '../components/GoogleAnalytics'

export default function RootLayout({
"@
}
if ($layoutContent -notmatch "<GoogleAnalytics") {
    $layoutContent = $layoutContent -replace "<body>", @"
<body>
        <GoogleAnalytics GA_MEASUREMENT_ID="G-NDXHPC8TS9" />
"@
}
Set-Content "src\app\layout.tsx" $layoutContent

Write-Host "Google Analytics component has been added and layout.tsx has been updated."
Write-Host "Please ensure to build and deploy the project in production environment for the changes to take effect."