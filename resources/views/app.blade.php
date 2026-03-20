<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

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
            $seoTitle = $page['props']['seo']['title'] ?? config('app.name', 'Laravel');
            $seoDescription = $page['props']['seo']['description'] ?? '';
            $seoCanonical = $page['props']['seo']['canonical'] ?? url()->current();
            $seoOgImage = $page['props']['seo']['ogImage'] ?? (rtrim(config('app.url'), '/') . '/personaitor.png');
        @endphp

        <link rel="canonical" href="{{ $seoCanonical }}">
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'Laravel') }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $seoCanonical }}">
        <meta property="og:image" content="{{ $seoOgImage }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoOgImage }}">

        <script type="application/ld+json">{!! json_encode([
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'WebSite',
                    '@id' => rtrim(config('app.url'), '/').'/#website',
                    'url' => rtrim(config('app.url'), '/').'/',
                    'name' => config('app.name', 'Laravel'),
                ],
                [
                    '@type' => 'Organization',
                    '@id' => rtrim(config('app.url'), '/').'/#organization',
                    'name' => config('app.name', 'Laravel'),
                    'url' => rtrim(config('app.url'), '/').'/',
                    'logo' => rtrim(config('app.url'), '/').'/favicon.png',
                ],
            ],
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

        <link rel="icon" href="/favicon.png" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

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
