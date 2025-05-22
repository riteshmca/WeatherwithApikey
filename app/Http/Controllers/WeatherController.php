<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\WeatherRequest;
use App\Models\Weather;
use App\Models\Locations;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class WeatherController extends Controller
{
    /**
     * Display a listing of weather data for API
     */
    public function index()
    {
        return Inertia::render('Weather', [
            'weatherData' => Weather::all(),
            'locations' => Locations::all(),
        ]);
    }
    public function apiIndex()
    {
        $weatherData = Weather::all();
        $locations = Locations::all();

        return response()->json([
            'weatherData' => $weatherData,
            'locations' => $locations,
            'status' => 'success'
        ]);
    }

    /**
     * Debug endpoint to check API connectivity
     */
    public function debug()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'API is working correctly',
            'timestamp' => now(),
            'locations_count' => Locations::count(),
            'weather_count' => Weather::count(),
        ]);
    }

}