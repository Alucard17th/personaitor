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

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/terms', [HomeController::class, 'terms'])->name('terms');
Route::get('privacy-policy', [HomeController::class, 'privacy'])->name('privacy');

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
