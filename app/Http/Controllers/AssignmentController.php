<?php

namespace App\Http\Controllers;
use App\Models\Assignment;
use App\Models\Course;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
class AssignmentController extends Controller
{
    public function createAssignment(Request $request, Course $course)
{
    // Ensure the teacher is assigned to this course
    if ($course->teacher_id != Auth::id()) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string|max:1000',
        'due_date' => 'required|date',
    ]);

    $assignment = new Assignment([
        'title' => $validated['title'],
        'description' => $validated['description'],
        'due_date' => $validated['due_date'],
        'course_id' => $course->id,
    ]);
    $assignment->save();

    return response()->json(['message' => 'Assignment created successfully', 'assignment' => $assignment]);
}

}
