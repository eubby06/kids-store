<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\StoreFrontController;

// customer facing
Route::inertia('/login', 'Frontend/Auth/Login')->name('login');
Route::inertia('/register', 'Frontend/Auth/Register')->name('register');
Route::inertia('/cart', 'Frontend/Pages/Cart')->name('cart');
Route::inertia('/privacy-policy', 'Frontend/Pages/PrivacyPolicy')->name('privacy.policy');
Route::inertia('/refund-policy', 'Frontend/Pages/RefundPolicy')->name('reund.policy');
Route::inertia('/terms-of-service', 'Frontend/Pages/TermsOfService')->name('terms.of.service');

Route::get('/', [StoreFrontController::class, 'index'])->name('home');
Route::get('/products', [ProductsController::class, 'getAll'])->name('products');
Route::get('/products/{slug}', [ProductsController::class, 'getId'])->name('products.show');

// admin facing
Route::inertia('/admin/login', 'Admin/Auth/Login')->name('admin.login');