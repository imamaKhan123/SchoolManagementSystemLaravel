<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentRegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AssignmentSubmissionController;

use App\Models\Slider;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
    Route::get('/teachers', [UserController::class, 'getTeachers']);
    Route::get('/students', [StudentController::class, 'getStudents']);
    Route::get('/students/{id}', [StudentController::class, 'getStudent']);
    Route::post('/students/{id}', [StudentController::class, 'addStudent']);
    Route::put('/students/{id}', [StudentController::class, 'updateStudent']);
    Route::delete('/students/{id}', [StudentController::class, 'deleteStudent']);
    Route::get('/student-profile/{id}', [StudentController::class, 'show']);
    Route::get('/student/{id}', [StudentController::class, 'getStudentId']);
    Route::post('/attendance/mark/{studentId}', [AttendanceController::class, 'markAttendance']);
    Route::get('/attendance/view/{studentId}', [AttendanceController::class, 'viewAttendance']);
    Route::post('/attendance/mark-class', [AttendanceController::class, 'markClassAttendance']);
    Route::get('/attendance/report', [AttendanceController::class, 'attendanceReport']);
    
    Route::get('/attendance/view-class/{class}/{date}', [AttendanceController::class, 'viewClassAttendance']);
    // Route for Slider
    Route::get('/sliders', function () {
        return response()->json(Slider::all());
    });
    Route::post('students/{studentId}/upload-documents', [StudentRegistrationController::class, 'uploadDocuments']);
    
    Route::delete('/documents/{id}', [DocumentsController::class, 'destroy']);
    Route::post('students/{studentId}/enroll', [StudentController::class, 'enrollStudent']);

    Route::get('/courses', [CourseController::class, 'index']); // Fetch all courses
    Route::resource('courses', CourseController::class);
    Route::get('/teacher-courses', [CourseController::class, 'getCourseForTeacher']);
    Route::get('/student/{id}/progress', [StudentController::class, 'getEnrolledCoursesWithProgress']);
    Route::get('/course/{id}/assignments', [StudentController::class, 'getCourseAssignments']);
    Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/assignments/{assignment}/submit', [AssignmentSubmissionController::class, 'submit']);
    Route::get('/assignments/{assignmentId}/submissions', [AssignmentSubmissionController::class, 'getSubmissions']);

    Route::delete('/assignments/{assignment}/submission', [AssignmentSubmissionController::class, 'deleteSubmission']);
    Route::post('/assignments/{assignment}/grade', [AssignmentSubmissionController::class, 'gradeSubmission']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);