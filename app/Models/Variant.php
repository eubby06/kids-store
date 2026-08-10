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
        'stock_count',
        'price_override',
        'is_on_sale',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
