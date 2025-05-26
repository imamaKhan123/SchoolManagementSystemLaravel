<?php

namespace App\Http\Controllers;

use App\Models\Enrollments;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use App\Models\User;
use App\Models\Assignment;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function getStudents(Request $request)
{
    // Fetch query parameters
    $query = $request->input('query', ''); // Search query
    $perPage = $request->input('per_page', 10); // Items per page, default 10
    
    // Query students table
    $students = DB::table('students')
        ->join('users', 'students.user_id', '=', 'users.id') // Join with users table to access related user data
        ->select('students.*', 'users.name', 'users.email','users.grade', 'users.role') // Select necessary columns
        ->when($query, function ($q) use ($query) {
            // Filter by name or email if query is provided
            $q->where(function ($q) use ($query) {
                $q->where('users.name', 'like', "%$query%")
                  ->orWhere('users.email', 'like', "%$query%");
            });
        })
        ->paginate($perPage); // Paginate the results
    
    // Return paginated list of students
    return response()->json($students);
    
} 
public function getStudent($id)
{
     // Query students table
     $student = DB::table('students')
     ->join('users', 'students.user_id', '=', 'users.id') // Join with users table to access related user data
     ->select( 'users.name', 'users.email', 'users.grade','users.salary', 'students.id', 'users.password') // Select necessary columns
     ->where('users.id', $id)
     ->first();

    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404);
    }

    return response()->json(['message' => 'Student found', 'data'=> $student],200);
}

public function getStudentId($id)
{
     // Query students table
     $student = DB::table('students')
     ->join('users', 'students.user_id', '=', 'users.id') // Join with users table to access related user data
     ->select(  'students.id','users.designation') // Select necessary columns
     ->where('users.id', $id)
     ->first();

    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404);
    }

    return response()->json(['message' => 'Student found', 'data'=> $student],200);
}

public function addStudent($id, Request $request)
    {
        // Validate if the user exists in the users table
        $validated = $request->validate([
            'id' => 'required|exists:users,id', // Validate the ID is a valid user ID
        ]);

        // Check if the user already exists in the students table
        $existingStudent = DB::table('students')->where('user_id', $validated['id'])->first();

        if ($existingStudent) {
            return response()->json(['message' => 'User is already a student'], 409); // Conflict if already added
        }

        // Insert the user into the students table
        DB::table('students')->insert([
            'user_id' => $validated['id'],
            'grade' => null, // Default value for grade
            'marks' => null, // Default value for marks
            'created_at' => now(),
            'updated_at' => now(),
        ]);

         // Update the designation of the user to "student" in the users table
    DB::table('users')->where('id', $validated['id'])->update([
        'designation' => 'Student', // Assuming 'designation' is the column name
    ]);
        return response()->json(['message' => 'Student added successfully'], 201); // Success message
    }
    public function updateStudent($id, Request $request)
    {
        // Validate if the user exists in the users table
        $validated = $request->validate([
            'id' => 'required|exists:users,id', // Validate the ID is a valid user ID
        ]);
    
        // Find the User and Student records using Eloquent
        $user = User::find($validated['id']); // Eloquent model for User
      // Check if the user already exists in the students table
      $student = DB::table('students')->where('user_id', $validated['id'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }
    
        // Update the User table fields if provided
     DB::table('users')
     ->where('id', $validated['id']) // Ensure only the intended user is updated
     ->update(array_merge(
         $request->only([
             'name',
             'email',
             'role',
             'designation',
             'salary',
             'grade',
         ]),
         [
             'password' => bcrypt($request->input('password')),
         ]
     ));

// Update the Student table fields if provided
DB::table('students')
->where('user_id', $validated['id']) // Ensure only the intended student is updated
->update($request->only([
    'grade',
    'marks',
]));
    
        return response()->json(['message' => 'Student and user details updated successfully'], 200);
    }
    public function show($id)
{
        // Query students table
        $student = DB::table('students')
        ->join('users', 'students.user_id', '=', 'users.id') // Join with users table to access related user data
        ->select( 'users.name', 'users.email', 'users.grade','users.salary', 'students.id','users.created_at') // Select necessary columns
        ->where('students.id', $id)
        ->first();
   
       if (!$student) {
           return response()->json(['message' => 'Student not found'], 404);
       }
  
    // Query the documents table for the student's documents
    $documents = DB::table('documents')
        ->where('student_id', $id)
        ->get();

    // Identify the profile picture if available
    $profilePicture = $documents->firstWhere('type', 'profile_picture');
    
    $enrolledCourses = DB::table('enrollments')
    ->join('courses', 'enrollments.course_id', '=', 'courses.id')
    ->where('enrollments.student_id', $id)
    ->select('courses.id', 'courses.name', 'courses.code', 'courses.description')
    ->get();
    return response()->json([
        'message' => 'Student found',
        'data' => [
            'student' => $student,
            'documents' => $documents,
            'profile_picture' => $profilePicture,
            'enrolled_courses' => $enrolledCourses,
        ],
    ], 200);
}
    public function deleteStudent($id)
{
    // Check if the student exists in the students table
    $student = DB::table('students')->where('user_id', $id)->first();

    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404); // If student does not exist
    }

    // Update the designation in the users table to null
    DB::table('users')->where('id', $id)->update(['designation' => 'none']);

    // Delete the student record from the students table
    DB::table('students')->where('user_id', $id)->delete();

    return response()->json(['message' => 'Student deleted successfully'], 200);
}

public function enrollStudent(Request $request, $id)
{
    try {
        // Validate input
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);  
    
        // // Check if the student is already enrolled in the course
        $existingEnrollment = Enrollments::where('student_id', $id)
            ->where('course_id', $request->course_id)
            ->first();

        if ($existingEnrollment) {
            return response()->json(['message' => 'Student is already enrolled in this course.'], 400);
        }

        // Create a new enrollment record
        $enrollment = Enrollments::create([
            'student_id' => $id,
            'course_id' => $request->course_id,
        ]);
      
        return response()->json(['message' => 'Student enrolled successfully.', 'enrollment' => $enrollment], 201);
    } catch (\Exception $e) {
        
        return response()->json(['message' => 'Internal Server Error'], 500);
    }
}
public function getEnrolledCoursesWithProgress($id)
{
    $student = Student::with('enrollments.course')->findOrFail($id);
    
    $enrolledCourses = $student->enrollments->map(function ($enrollment) {
        return [
            'course_name' => $enrollment->course->name,
            'progress' => $enrollment->progress,
            'grade' => $enrollment->grade,
          'id' => $enrollment->course->id,
         'name' => $enrollment->course->name, 
         'code' => $enrollment->course->code, 
         'description' => $enrollment->course->description,
           
            
        ];
    });

    return response()->json([
        'enrolled_courses' => $enrolledCourses,
    ]);
}
// public function getCourseAssignments($courseId)
// {
//     $assignments = Assignment::where('course_id', $courseId)->get();

//     return response()->json([
//         'assignments' => $assignments,
//     ]);
// }
public function getCourseAssignments($courseId, Request $request)
{
    $userId = $request->user()->id;

    // // Clear cache for fresh data
    // Cache::forget("course_assignments_{$courseId}_{$userId}");

    $assignments = Assignment::where('course_id', $courseId)
        ->with(['submission' => function ($query) use ($userId) {
            $query->where('user_id', $userId);
        }])
        ->get();

    return response()->json([
        'assignments' => $assignments,
    ]);
}



}
