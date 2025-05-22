<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LocationRequest;
use App\Models\Locations;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use App\Models\Weather;
use Illuminate\Support\Facades\Log;

class LocationController extends Controller
{
    public function apiIndex()
    {
        // $weatherData = Weather::all();
        $locations = Locations::all();

        return response()->json([
            // 'weatherData' => $weatherData,
            'locations' => $locations,
            'status' => 'success'
        ]);
    }

    /**
     * Store a newly created location in the database.
     *
     * @param  \App\Http\Requests\LocationRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(LocationRequest $request)
    {
        dd($request);
        try {
            $location = Locations::create($request->validated());

            Log::info('Location created:', $location->toArray()); // Add logging

            return response()->json([
                'message' => 'Location created successfully',
                'location' => $location,
                'status' => 'success'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Location creation failed:', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to create location',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
}