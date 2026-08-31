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
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Primary Auto-Increment ID
            $table->string('name'); // Product Name
            $table->string('slug')->unique(); // URL Friendly version of Name (e.g. minimalist-backpack)
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Product Category (e.g. Travel, Audio)

            // Storing price safely using integer cents (e.g., $120.00 is stored as 12000)
            // This prevents common floating-point rounding bugs in financial math
            $table->unsignedInteger('price'); 
            
            $table->text('description')->nullable(); // Optional detailed product overview
            $table->boolean('is_featured')->default(false); // Quick toggle for landing page exhibits
            $table->boolean('is_new_arrival')->default(false);
            $table->boolean('is_exclusive')->default(false); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
