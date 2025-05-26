<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

use Illuminate\Support\Facades\Auth;
class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         // Get all courses from the database
         $courses = Course::all();

         // Return the courses as JSON
         return response()->json(['data' => $courses]);
    }
    public function getCourseForTeacher(Request $request)
    {
        // Ensure the user is authenticated
    $user = $request->user();

    // if ($user->designation !== 'teacher') {
    //     return response()->json(['error' => 'Unauthorized'], 403);
    // }

    // Fetch courses for the authenticated teacher
    $courses = Course::where('teacher_id', $user->id)->get();

    return response()->json(['data' => $courses]);

    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses',
            'description' => 'nullable|string',
        ]);

        $course = Course::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'],
            'teacher_id' => Auth::id(), // Assign the current teacher as the owner
        ]);

        return response()->json(['message' => 'Course created successfully', 'course' => $course], 201);
    
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $course = Course::findOrFail($id);

        // Ensure the authenticated teacher owns the course
        if ($course->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['course' => $course]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);

        // Ensure the authenticated teacher owns the course
        if ($course->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code,' . $course->id,
            'description' => 'nullable|string',
        ]);

        $course->update($validated);

        return response()->json(['message' => 'Course updated successfully', 'course' => $course]);
   
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $course = Course::findOrFail($id);

        

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    
    }
}
