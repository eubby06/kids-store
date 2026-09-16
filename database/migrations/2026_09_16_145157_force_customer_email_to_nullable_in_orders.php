<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // 1. Drop the stubborn non-nullable column completely
            $table->dropColumn('customer_email');
        });

        Schema::table('orders', function (Blueprint $table) {
            // 2. Re-create it cleanly as an explicitly nullable string
            $table->string('customer_email')->nullable()->after('total_amount');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_email')->nullable(false)->change();
        });
    }
};
