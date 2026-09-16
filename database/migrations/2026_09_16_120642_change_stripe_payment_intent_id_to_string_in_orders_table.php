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
        Schema::table('orders', function (Blueprint $table) {
            // Converts the column to a VARCHAR string to accommodate Stripe's "pi_xxx" format
            $table->string('stripe_payment_intent_id', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Reverts the column back to integer if rolled back
            // Warning: Existing string values ("pi_xxx") will fail to convert back to integers unless the table is cleared first.
            $table->integer('stripe_payment_intent_id')->nullable()->change();
        });
    }
};
