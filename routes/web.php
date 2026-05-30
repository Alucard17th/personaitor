<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\App\DashboardController;
use App\Http\Controllers\App\PersonaController;
use App\Http\Controllers\App\CategoryController;
use App\Http\Controllers\App\CampaignController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\BlogController;

Route::get('/sitemap.xml', function () {
    $baseUrl = rtrim(config('app.url'), '/');
    $urls = [
        '/',
        '/terms',
        '/privacy-policy',
        '/free/persona-builder',
        '/free/utm-builder',
        '/blog',
    ];

    try {
        $posts = \Illuminate\Support\Facades\DB::table('blogavel_posts')
            ->select(['slug', 'updated_at', 'published_at', 'status'])
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->get();

        foreach ($posts as $post) {
            if (!isset($post->slug) || $post->slug === '') {
                continue;
            }
            $urls[] = '/blog/'.ltrim((string) $post->slug, '/');
        }
    } catch (\Throwable $e) {
        // Ignore sitemap blog entries if blog tables are not available.
    }

    $entries = collect($urls)->map(function (string $path) use ($baseUrl) {
        $loc = $baseUrl.$path;
        return "<url><loc>{$loc}</loc></url>";
    })->implode('');

    $xml = '<?xml version="1.0" encoding="UTF-8"?>'
        .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        .$entries
        .'</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/terms', [HomeController::class, 'terms'])->name('terms');
Route::get('privacy-policy', [HomeController::class, 'privacy'])->name('privacy');

Route::get('/free/persona-builder', function () {
    return Inertia::render('free/persona-builder', [
        'seo' => [
            'title' => 'Free Buyer Persona Builder — Drag & Drop Persona Maker | Personaitor',
            'description' => 'Build, customize and export a marketing persona for free. Drag-and-drop canvas, theming, PNG/PDF export — no sign-up required. Perfect for founders, marketers, and UX teams.',
            'keywords' => 'free persona builder, buyer persona generator, marketing persona maker, user persona template, ICP builder, free persona canvas, persona export',
            'canonical' => url('/free/persona-builder'),
        ],
    ]);
})->name('free.persona-builder');

Route::get('/free/utm-builder', function () {
    return Inertia::render('free/utm-builder', [
        'seo' => [
            'title' => 'Free UTM Builder — Generate Tracked Campaign URLs | Personaitor',
            'description' => 'Build clean, tracked URLs with utm_source, utm_medium, utm_campaign, utm_term and utm_content. Free UTM link generator for Google Analytics, GA4, ads and email — no sign-up required.',
            'keywords' => 'free UTM builder, UTM link generator, campaign URL builder, utm_source, utm_medium, utm_campaign, GA4 UTM, Google Analytics tracking URL',
            'canonical' => url('/free/utm-builder'),
        ],
    ]);
})->name('free.utm-builder');

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

Route::prefix('app')->middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // PERSONAS
    // JSON helpers / actions
    Route::post('personas/generate', [PersonaController::class, 'generate'])->name('personas.generate');
    Route::post('personas/{id}/toggle-favorite', [PersonaController::class, 'toggleFavorite'])->name('personas.toggle');
    Route::get('personas/{id}/export.csv', [PersonaController::class, 'exportCsv'])->name('personas.export.csv');
    Route::get('personas/{id}/export.json', [PersonaController::class, 'exportJson'])->name('personas.export.json');
    Route::get('personas/compare', [PersonaController::class, 'compare'])->name('personas.compare');
    // CRUD
    Route::resource('personas', PersonaController::class);
    Route::get('favorites', [PersonaController::class, 'indexFavorites'])->name('personas.favorites.index');

    // CATEGORIES
    Route::resource('categories', CategoryController::class);

    // CAMPAIGNS
    Route::resource('campaigns', CampaignController::class);

    // PAYMENT
    Route::post('/billing/checkout', [BillingController::class, 'checkout'])
        ->name('billing.checkout');

    Route::get('/billing/success', [BillingController::class, 'success'])
        ->name('billing.success');

    Route::get('/billing/cancel', [BillingController::class, 'cancel'])
        ->name('billing.cancel');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
