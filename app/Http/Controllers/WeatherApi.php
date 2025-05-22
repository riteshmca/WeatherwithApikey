<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\WeatherService;

class WeatherApi extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function index(Request $request)
    {
        $city = $request->input('city', 'Delhi'); // Default to London if no city provided
        $weatherData = $this->weatherService->getWeatherByCity($city);

        return Inertia::render('Dashboard', [
            'weatherData' => $weatherData,
            'city' => $city,
        ]);
    }
}