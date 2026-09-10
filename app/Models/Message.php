<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'email',
        'status',
        'message',
        'order_number'
    ];
}
