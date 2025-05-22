<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeatherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'location' => new LocationResource($this->location),
            'temperature' => $this->temperature,
            'humidity' => $this->humidity,
            'wind_speed' => $this->wind_speed,
            'precipitation' => $this->precipitation,
            'created_at' => $this->created_at
        ];
    }
}
