<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\StoreFrontController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminProductsController;
use App\Http\Controllers\AdminCategoriesController;
use App\Http\Controllers\AdminOrdersController;
use App\Http\Controllers\AdminMessagesController;
use App\Http\Controllers\AdminCouponsController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ProductSearchController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponsController;


// customer facing
Route::inertia('/login', 'Frontend/Auth/Login')->name('login');
Route::inertia('/register', 'Frontend/Auth/Register')->name('register');
Route::inertia('/cart', 'Frontend/Pages/Cart')->name('cart');
Route::inertia('/privacy-policy', 'Frontend/Pages/PrivacyPolicy')->name('privacy.policy');
Route::inertia('/refund-policy', 'Frontend/Pages/RefundPolicy')->name('reund.policy');
Route::inertia('/terms-of-service', 'Frontend/Pages/TermsOfService')->name('terms.of.service');

Route::get('/', [StoreFrontController::class, 'index'])->name('home');
Route::get('/contact-us', [MessagesController::class, 'index'])->name('contact.index');
Route::post('/contact-us', [MessagesController::class, 'submit'])->name('contact.submit');
Route::post('/cart/coupon', [CouponsController::class, 'apply'])->name('coupon.apply');
Route::post('/cart/items', [CartController::class, 'items'])->name('cart.items');
Route::delete('/cart/items', [CartController::class, 'remove'])->name('cart.delete');
Route::put('/cart/items/update', [CartController::class, 'update'])->name('cart.update');
Route::get('/products', [ProductsController::class, 'getAll'])->name('products');
Route::get('/products/{slug}', [ProductsController::class, 'getId'])->name('products.show');
Route::get('/checkout', [CheckoutController::class, 'showCheckoutForm'])->name('checkout');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/show', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout/initialize', [CheckoutController::class, 'initialize'])->name('checkout.initialize');
Route::post('/chatbot/query', ChatbotController::class)->name('chatbot.query');
Route::get('/api/search/autocomplete', ProductSearchController::class)->name('api.search.autocomplete');

Route::get('/admin/login', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'postLogin'])->name('admin.login');

Route::middleware(['auth'])->prefix('admin')->group(function () {
    
    Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/orders', [AdminOrdersController::class, 'index'])->name('admin.orders');
    Route::get('/', [AdminController::class, 'index'])->name('admin');

    Route::group(['prefix' => 'categories'], function () {
        Route::get('/', [AdminCategoriesController::class, 'getAll'])->name('admin.categories');
        Route::get('/create', [AdminCategoriesController::class, 'create'])->name('admin.categories.create');
        Route::post('/',[AdminCategoriesController::class, 'store'])->name('admin.categories.store');
        Route::put('/{id}', [AdminCategoriesController::class, 'update'])->name('admin.categories.update');
        Route::get('/{id}/edit', [AdminCategoriesController::class, 'edit'])->name('admin.categories.edit');
        Route::delete('/{id}', [AdminCategoriesController::class, 'destroy'])->name('admin.categories.destroy');
    });

    Route::group(['prefix' => 'coupons'], function () {
        Route::get('/', [AdminCouponsController::class, 'index'])->name('coupons.index');
        Route::post('/', [AdminCouponsController::class, 'store'])->name('coupons.store');
        Route::patch('/{coupon}/toggle', [AdminCouponsController::class, 'toggleActive'])->name('coupons.toggle');
        Route::delete('/{coupon}', [AdminCouponsController::class, 'destroy'])->name('coupons.destroy');
    });

    Route::group(['prefix' => 'products'], function () {
        Route::get('/', [AdminProductsController::class, 'getAll'])->name('admin.products');
        Route::post('/', [AdminProductsController::class, 'store'])->name('admin.products.store');
        Route::get('/create', [AdminProductsController::class, 'create'])->name('admin.products.create');
        Route::delete('/{id}', [AdminProductsController::class, 'destroy'])->name('admin.products.destroy');
        Route::get('/{id}/edit', [AdminProductsController::class, 'edit'])->name('admin.products.edit');
        Route::put('/{id}', [AdminProductsController::class, 'update'])->name('admin.products.update');
    });

    Route::group(['prefix' => 'messages'], function () {
        Route::get('/', [AdminMessagesController::class, 'getAll'])->name('admin.messages');
    });
});

