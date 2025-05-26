<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Assignment;
class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Assignment::create([
            'title' => 'Math Homework',
            'description' => 'Complete exercises 1-10',
            'course_id' => 1, // Make sure the course_id exists in your courses table
            'due_date' => '2025-01-15',
        ]);
    }
}
