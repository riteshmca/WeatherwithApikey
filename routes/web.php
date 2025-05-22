<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\WeatherApi;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/weather/create', [WeatherController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/dashboard', [WeatherApi::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Weather routes
    Route::get('/weather', [WeatherController::class, 'index'])->name('weather.index');
    Route::post('/weather', [WeatherController::class, 'store'])->name('weather.store');
    Route::put('/weather/{id}', [WeatherController::class, 'update'])->name('weather.update');
    Route::delete('/weather/{id}', [WeatherController::class, 'destroy'])->name('weather.destroy');

    // Location routes
    Route::post('/location', [LocationController::class, 'store'])->name('location.store');
    Route::put('/location/{id}', [LocationController::class, 'update'])->name('location.update');
    Route::delete('/location/{id}', [LocationController::class, 'destroy'])->name('location.destroy');
});

require __DIR__ . '/auth.php';