<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Locations;
use App\Models\Weather;
use App\Models\User;
class LocationService
{
    public function createWeather($request): Book
    {
        return Book::Create(
            [
                'book_name_english' => $request['book_name_english'],
                'book_name_hindi' => $request['book_name_hindi'],
                'is_active' => $request['is_active'],
            ]
        );
    }

    public function WeatherList(): array
    {
        $BookList = [
            'BookList' => Book::all()->toArray(),
        ];

        return $BookList;
    }

    public function updateWeather($request)
    {
        //dd($request);
        $book = Book::where('id', $request->id)->first();

        $book->book_name_english = $request['book_name_english'];
        $book->book_name_hindi = $request['book_name_hindi'];
        $book->is_active = $request['is_active'];
        $book->save();

        return $book;
    }

    public function deleteWeather($id)
    {
        $book = Book::find($id);

        return $book->delete();
        //dd($id);
        //return false;
    }
}