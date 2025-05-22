<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use app\Models\Locations;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Weather extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'temperature',
        'humidity',
        'wind_speed',
        'precipitation',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Locations::class, 'location_id');
    }
}
