<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\LocationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes for debugging
Route::get('/weather', [WeatherController::class, 'apiIndex']);
Route::get('/weather/debug', [WeatherController::class, 'debug']);
Route::get('/location', [LocationController::class, 'apiIndex']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Weather routes
    Route::post('/weather', [WeatherController::class, 'store']);
    Route::put('/weather/{id}', [WeatherController::class, 'update']);
    Route::delete('/weather/{id}', [WeatherController::class, 'destroy']);

    // Location routes
    Route::post('/location', [LocationController::class, 'store']);
    Route::put('/location/{id}', [LocationController::class, 'update']);
    Route::delete('/location/{id}', [LocationController::class, 'destroy']);
});