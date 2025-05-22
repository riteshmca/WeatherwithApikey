<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.openweathermap.org/data/2.5';

    public function __construct()
    {
        $this->apiKey = '44e8f36283855c8acb57b46511670305';
    }

    public function getWeatherByCity($city)
    {
        try {
            $response = Http::get("{$this->baseUrl}/weather", [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric',
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return ['error' => 'Unable to fetch weather data'];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}