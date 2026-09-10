<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessagesController extends Controller
{
    public function index()
    {
        return inertia('Frontend/Pages/Contact', [
            'status' => session('status')
        ]);
    }

    public function submit(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|min:3',
            'subject' => 'required',
            'message' => 'required',
            'order_number' => 'integer',
            'email' => 'required|email'
        ]);

        Message::create($data);

        return redirect()->back()->with('success', 'Message sent successfully!');
    }
}
