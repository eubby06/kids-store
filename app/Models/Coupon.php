<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
            'code',
            'type',
            'value',
            'min_order_amount',
            'usage_limit',
            'starts_at',
            'expires_at',
            'is_active',
    ];


    public function isValid()
    {
        if ($this->is_active) {
            return true;
        }

        return false;
    }
}
