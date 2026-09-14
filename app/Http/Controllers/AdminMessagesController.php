<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class AdminMessagesController extends Controller
{
    public function getAll()
    {
        $messages = Message::all();
        
        return inertia('Admin/Pages/Messages', [
            'status' => session('status'),
            'messages' => $messages
        ]);
    }
}
