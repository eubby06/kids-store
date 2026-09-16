<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            
            // Relates the payment method to your existing users table
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Stores Stripe's unique safe reference token (e.g., 'pm_1N...' or 'card_1N...')
            $table->string('stripe_payment_method_id')->unique();
            
            // Safe, non-sensitive card metadata to display back to the user in their UI
            $table->string('card_brand');      // e.g., 'visa', 'mastercard', 'amex'
            $table->string('card_last_four', 4); // e.g., '4242'
            $table->string('exp_month', 2);     // e.g., '12'
            $table->string('exp_year', 4);      // e.g., '2028'
            
            // Flags which card to use if they have multiple cards saved
            $table->boolean('is_default')->default(false);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
