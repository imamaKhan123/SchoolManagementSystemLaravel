<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
class TeacherController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Fetch courses taught by the teacher
        $courses = Course::where('teacher_id', $user->id)->with('assignments')->get();

        return response()->json([
            'courses' => $courses,
        ]);
    }
}
