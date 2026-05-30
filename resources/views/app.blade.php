<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
            $appName = config('app.name', 'Personaitor');
            $appUrl = rtrim(config('app.url'), '/');
            $seoTitle = $page['props']['seo']['title'] ?? $appName;
            $seoDescription = $page['props']['seo']['description'] ?? '';
            $seoKeywords = $page['props']['seo']['keywords'] ?? null;
            $seoCanonical = $page['props']['seo']['canonical'] ?? url()->current();
            $seoOgImage = $page['props']['seo']['ogImage'] ?? ($appUrl . '/personaitor.png');
            $isHome = rtrim(url()->current(), '/') === $appUrl;
        @endphp

        <link rel="canonical" href="{{ $seoCanonical }}">
        <meta name="description" content="{{ $seoDescription }}">
        @if($seoKeywords)<meta name="keywords" content="{{ $seoKeywords }}">@endif
        <meta name="author" content="{{ $appName }}">
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)">
        <meta name="format-detection" content="telephone=no">

        <meta property="og:type" content="website">
        <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}">
        <meta property="og:site_name" content="{{ $appName }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $seoCanonical }}">
        <meta property="og:image" content="{{ $seoOgImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $seoTitle }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoOgImage }}">
        <meta name="twitter:image:alt" content="{{ $seoTitle }}">

        <script type="application/ld+json">{!! json_encode([
            '@context' => 'https://schema.org',
            '@graph' => array_values(array_filter([
                [
                    '@type' => 'WebSite',
                    '@id' => $appUrl.'/#website',
                    'url' => $appUrl.'/',
                    'name' => $appName,
                    'description' => $seoDescription,
                    'inLanguage' => str_replace('_', '-', app()->getLocale()),
                    'publisher' => ['@id' => $appUrl.'/#organization'],
                    'potentialAction' => [
                        '@type' => 'SearchAction',
                        'target' => $appUrl.'/?s={search_term_string}',
                        'query-input' => 'required name=search_term_string',
                    ],
                ],
                [
                    '@type' => 'Organization',
                    '@id' => $appUrl.'/#organization',
                    'name' => $appName,
                    'url' => $appUrl.'/',
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => $appUrl.'/favicon.png',
                    ],
                ],
                $isHome ? [
                    '@type' => 'SoftwareApplication',
                    '@id' => $appUrl.'/#software',
                    'name' => $appName,
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'Web',
                    'url' => $appUrl.'/',
                    'description' => $seoDescription,
                    'offers' => [
                        '@type' => 'Offer',
                        'price' => '0',
                        'priceCurrency' => 'USD',
                    ],
                ] : null,
                $isHome ? [
                    '@type' => 'WebPage',
                    '@id' => $seoCanonical.'#webpage',
                    'url' => $seoCanonical,
                    'name' => $seoTitle,
                    'description' => $seoDescription,
                    'isPartOf' => ['@id' => $appUrl.'/#website'],
                    'primaryImageOfPage' => ['@type' => 'ImageObject', 'url' => $seoOgImage],
                ] : null,
            ])),
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

        <link rel="icon" href="/favicon.png" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />
        @if($isHome)
            <link rel="preload" as="image" href="/img/persona-3.png" fetchpriority="high">
        @endif

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
        @paddleJS
        @routes
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
