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

        Schema::dropIfExists('attendances');

        Schema::create('attendances', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('student_id'); // Foreign key to students table
            $table->date('date'); // Attendance date
            $table->boolean('status'); // Attendance status (1 for present, 0 for absent)
            $table->timestamps(); // created_at and updated_at columns

            // Foreign key constraint referencing the 'students' table
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
