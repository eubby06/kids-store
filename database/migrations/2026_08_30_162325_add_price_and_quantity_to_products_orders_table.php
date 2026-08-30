<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products_orders', function (Blueprint $table) {
            // Add quantity as an integer, defaulting to 1 item
            $table->integer('quantity')->default(1);
            
            // Add price as a decimal to save the historical cost snap at checkout
            $table->decimal('price', 10, 2)->default(0.00);
        });
    }

    public function down(): void
    {
        Schema::table('products_orders', function (Blueprint $table) {
            // Allows safe reversals if you roll back migrations later
            $table->dropColumn(['quantity', 'price']);
        });
    }
};
