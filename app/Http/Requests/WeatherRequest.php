<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeatherRequest extends FormRequest
{
    public function authorize()
    {
        return $this->wantsJson()
            ? $this->user() && $this->user()->tokenCan('weather:write')
            : true;
    }


    public function rules(): array
    {
        return [
            'location_id' => 'required|exists:locations,id',
            'temperature' => 'required|string|max:10',
            'humidity' => 'required|string|max:10',
            'wind_speed' => 'required|string|max:10',
            'precipitation' => 'required|string|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'location_id.required' => 'Location ID is required.',
            'location_id.exists' => 'The selected location does not exist.',

            'temperature.required' => 'Temperature is required.',
            'temperature.string' => 'Temperature must be a string.',
            'temperature.max' => 'Temperature must not exceed 10 characters.',

            'humidity.required' => 'Humidity is required.',
            'humidity.string' => 'Humidity must be a string.',
            'humidity.max' => 'Humidity must not exceed 10 characters.',

            'wind_speed.required' => 'Wind speed is required.',
            'wind_speed.string' => 'Wind speed must be a string.',
            'wind_speed.max' => 'Wind speed must not exceed 10 characters.',

            'precipitation.required' => 'Precipitation is required.',
            'precipitation.string' => 'Precipitation must be a string.',
            'precipitation.max' => 'Precipitation must not exceed 10 characters.',
        ];
    }
}