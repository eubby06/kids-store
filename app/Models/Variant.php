<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'color',
        'size',
        'image',
        'stock_count',
        'price_override',
        'is_on_sale',
        'is_exclusive',
        'is_new_arrival',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
