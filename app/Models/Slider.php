<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'image_path', // Stores the path to the image file
        'caption',    // Optional text displayed with the image
        'title',      // Title of the slide
        'description' // Description of the slide
    ];
}
