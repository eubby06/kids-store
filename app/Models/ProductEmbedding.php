<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductEmbedding extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'product_id',
        'chunk_text',
        'embedding',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
