<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrdersController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::all();

        return inertia('Admin/Pages/Orders', [
            'status' => session('status'),
            'orders' => $orders
        ]);
    }
}
