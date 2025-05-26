<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;

class StudentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    // Create students for existing users with role "student"
    $users = User::where('designation', 'Student')->get();

    foreach ($users as $user) {
        Student::create([
            'user_id' => $user->id,
            'grade' => 'A',
            'marks' => json_encode(['Math' => 85, 'Science' => 90]),
        ]);
    }
    }
}
