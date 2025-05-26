<?php

namespace App\Http\Controllers;


use App\Models\Student;
use App\Models\Documents;
use Illuminate\Http\Request;

class StudentRegistrationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:students,email',
            'phone' => 'required|string',
            'documents' => 'required|array',
            'documents.*' => 'file|mimes:jpg,png,pdf|max:2048',
        ]);

        // Create student
        $student = Student::create($validated);

        // Save documents
        foreach ($request->file('documents') as $file) {
            $filePath = $file->store('documents', 'public');
            Documents::create([
                'student_id' => $student->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
            ]);
        }

        return response()->json(['message' => 'Registration successful'], 201);
    }
    public function enroll(Request $request)
{
    $validated = $request->validate([
        'student_id' => 'required|exists:students,id',
        'course_id' => 'required|exists:courses,id',
    ]);

    $student = Student::findOrFail($validated['student_id']);
    $student->enrollments()->create(['course_id' => $validated['course_id']]);

    return response()->json(['message' => 'Student enrolled successfully'], 200);
}
public function uploadDocuments(Request $request, $studentId)
{
    $request->validate([
        'documents.*' => 'required|file|mimes:jpg,jpeg,png,pdf,docx|max:2048',
    ]);

    $student = Student::findOrFail($studentId);
// If a profile picture is uploaded
if ($request->hasFile('profile_picture')) {
    $profilePicture = $request->file('profile_picture');
    $profilePicturePath = $profilePicture->store('profile_pictures', 'public');
    
    // Store the profile picture as a document in the documents table
    $newDocument = new Documents();
    $newDocument->student_id = $student->id;
    $newDocument->file_path = $profilePicturePath;
    $newDocument->type = 'profile_picture'; // Set the type as profile_picture
    $newDocument->save();
}
    foreach ($request->file('documents') as $document) {
        $path = $document->store('documents', 'public');

        Documents::create([
            'student_id' => $student->id,
            'file_path' => $path,
            'type' => $request->type ?? null,
        ]);
    }

    return response()->json(['message' => 'Documents uploaded successfully!']);
}


}

