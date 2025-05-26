<?php

namespace App\Http\Controllers\Api;
use App\Models\Attendance;
use App\Models\Student;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\DB;
class AttendanceController extends Controller
{

    public function markAttendance(Request $request)
{
    $validated = $request->validate([
        'student_id' => 'required|exists:students,id',
        'date' => 'required|date',
        'status' => 'required|boolean',
    ]);
    try {
        // Insert the attendance record
        $attendance = Attendance::create($validated);

        return response()->json([
            'message' => 'Attendance marked successfully',
            'attendance' => $attendance
        ]);
    } catch (\Exception $e) {
        // Log the error for debugging
        Log::error('Error marking attendance: ' . $e->getMessage());

        return response()->json([
            'message' => 'Error marking attendance',
            'error' => $e->getMessage()
        ], 500);
    }
}

    
    // View attendance history for a student
    public function viewAttendance($studentId)
    {
       
        // $attendance = Attendance::where('student_id', $studentId)->orderBy('date', 'desc')->get();
    
        // Fetch attendance records for the student with the given student_id
        $attendance = DB::table('attendances')
            ->where('student_id', $studentId)
            ->get();  // Fetch all attendance records for the student
  // Check if attendance records exist
  if ($attendance->isEmpty()) {
    return response()->json([
        'message' => 'No attendance records found for this student.'
    ], 404);


    
}

// Return the attendance records as JSON
return response()->json([
    'student_id' => $studentId,
    'attendance' => $attendance
], 200); }
public function viewClassAttendance($class, $date)
{
    // Validate class and date inputs
    $validatedData = [
        'class' => $class,
        'date' => $date,
    ];
// First, check if there are any records with the given date
$attendance = Attendance::where('date', $date)->get();
// Check if there are any students with grade 'A'
$students = Student::where('grade', $class)->get();
$attendance = Attendance::where('date', '2024-12-31')
    ->whereHas('student', function ($query) {
        return $query->where('grade', 'A');
    })
    ->get();

  


 // Return the attendance data as JSON
 return response()->json([
    'attendance' => $attendance
]);
    
}


    // Admin: Attendance report
    public function attendanceReport()
    {
        $report = Attendance::with('student')->get();

        return response()->json(['report' => $report]);
    }

    public function markClassAttendance(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'attendance' => 'required|array',
                'attendance.*.student_id' => 'required|exists:students,id',
                'attendance.*.date' => 'required|date',
                'attendance.*.status' => 'required|boolean',
               
       
            ]);
    
            foreach ($validatedData['attendance'] as $attendanceEntry) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $attendanceEntry['student_id'],
                        'date' => $attendanceEntry['date'],
                    ],
                    [
                        'status' => $attendanceEntry['status'],
                    ]
                );
            }
    
            return response()->json(['message' => 'Attendance marked successfully!'], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error marking class attendance: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }
    public function index(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|exists:students,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $query = Attendance::where('student_id', $data['student_id']);

        if ($request->has('start_date')) {
            $query->where('date', '>=', $data['start_date']);
        }

        if ($request->has('end_date')) {
            $query->where('date', '<=', $data['end_date']);
        }

        $attendance = $query->get();

        return response()->json($attendance);
    }
    // In AttendanceController.php
public function destroy($id)
{
    $attendance = Attendance::find($id);
    
    if (!$attendance) {
        return response()->json(['error' => 'Record not found'], 404);
    }

    $attendance->delete();

    return response()->json(['message' => 'Attendance record deleted successfully.']);
}

}
