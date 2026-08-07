<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\StoreFrontController;

// customer facing
Route::inertia('/login', 'frontend/auth/login')->name('login');
Route::inertia('/register', 'frontend/auth/register')->name('register');

Route::get('/', [StoreFrontController::class, 'index'])->name('home');
Route::get('/products', [ProductsController::class, 'products'])->name('products');

// admin facing
Route::inertia('/admin/login', 'admin/auth/login')->name('admin.login');