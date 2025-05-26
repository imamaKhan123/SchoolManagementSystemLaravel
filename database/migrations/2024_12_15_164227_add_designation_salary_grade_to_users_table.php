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
        Schema::table('users', function (Blueprint $table) {
            $table->string('designation')->nullable()->after('email'); // Add a column for designation
            $table->decimal('salary', 10, 2)->nullable()->after('designation'); // Add a column for salary
            $table->string('grade')->nullable()->after('salary'); // Add a column for grade
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['designation', 'salary', 'grade']); // Drop added columns
       
        });
    }
};
