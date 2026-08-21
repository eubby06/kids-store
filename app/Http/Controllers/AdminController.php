<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return inertia('Admin/Pages/Dashboard', [
            'status' => session('status')
        ]);
    }

    public function login(Request $request)
    {
        dd($request->all());
    }
}
