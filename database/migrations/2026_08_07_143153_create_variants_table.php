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
        Schema::create('variants', function (Blueprint $table) {
            $table->id();
            // Connects this variant to the parent product
            $table->foreignId('product_id')->constrained()->onDelete('cascade');

            // The SKU column
            $table->string('sku')->unique()->index();

            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->integer('stock_count')->default(0);
            $table->decimal('price_override', 8, 2)->nullable();
            $table->boolean('is_on_sale')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variants');
    }
};
