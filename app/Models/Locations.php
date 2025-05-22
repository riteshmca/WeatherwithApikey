<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use app\Models\Weather;

class Locations extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_name',
        'location_latitude',
        'location_longitude',
    ];

    public function weather()
    {
        return $this->hasMany(Weather::class, 'location_id');
    }
}
