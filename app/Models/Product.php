<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'price',
        'description',
        'images',
        'is_featured',
        'is_new_arrival',
        'is_exclusive',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function variants()
    {
        return $this->hasMany(Variant::class);
    }
}
