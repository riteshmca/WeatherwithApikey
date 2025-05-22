<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LocationRequest extends FormRequest
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
            'location_name' => 'required|string|max:255',
            'location_latitude' => 'required|numeric',
            'location_longitude' => 'required|numeric',
        ];
    }

    public function messages(): array
    {
        return [
            'location_name.required' => 'Location name is required.',
            'location_name.string' => 'Location name must be a string.',
            'location_name.max' => 'Location name must not exceed 255 characters.',

            'location_latitude.required' => 'Latitude is required.',
            'location_latitude.numeric' => 'Latitude must be a number.',

            'location_longitude.required' => 'Longitude is required.',
            'location_longitude.numeric' => 'Longitude must be a number.',
        ];
    }
}