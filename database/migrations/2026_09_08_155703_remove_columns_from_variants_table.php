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
        Schema::table('variants', function (Blueprint $table) {
            $table->dropColumn(['is_exclusive', 'is_featured', 'is_new_arrival']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->boolean('is_exclusive')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new_arrival')->default(false);
        });
    }
};
