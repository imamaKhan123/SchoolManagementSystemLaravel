<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // Import the User model

class UserFieldsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Fetch all users and update designation, salary, and grade
         User::all()->each(function ($user) {
            $user->update([
                'designation' => $this->randomDesignation(),
                'salary' => $this->randomSalary(),
                'grade' => $this->randomGrade(),
            ]);
        });
    }
     /**
     * Generate a random designation.
     */
    private function randomDesignation()
    {
        $designations = ['Teacher', 'Principal', 'Clerk', 'Accountant', 'Librarian'];
        return $designations[array_rand($designations)];
    }
      /**
     * Generate a random salary.
     */
    private function randomSalary()
    {
        return rand(30000, 120000); // Generate a random salary between 30,000 and 120,000
    }
      /**
     * Generate a random grade.
     */
    private function randomGrade()
    {
        $grades = ['A', 'B', 'C'];
        return $grades[array_rand($grades)];
    }
}
