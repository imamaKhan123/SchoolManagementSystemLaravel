<?php

namespace App\Http\Controllers;

use App\Models\AssignmentSubmission;

use App\Models\Assignment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class AssignmentSubmissionController extends Controller
{

    public function submit(Request $request, Assignment $assignment)
    {
        // Validate the incoming file
        $request->validate(['file' => 'required|file']);
    
        $user = $request->user();
    
        // Check for an existing submission
        $existingSubmission = AssignmentSubmission::where('user_id', $user->id)
            ->where('assignment_id', $assignment->id)
            ->first();
    
        if ($existingSubmission) {
            // Delete old file
            Storage::delete($existingSubmission->file_path);
            $existingSubmission->delete();
        }
    
        // Store the new file
        $filePath = $request->file('file')->store('submissions');
    
        // Create a new submission
        $submission = AssignmentSubmission::create([
            'assignment_id' => $assignment->id, // Ensure this is resolved
            'user_id' => $user->id,
            'file_path' => $filePath,
        ]);
    
        return response()->json([
            'message' => 'Submission uploaded successfully.',
            'submission' => $submission,
        ]);
    }
    

    public function deleteSubmission(Assignment $assignment, Request $request)
    {
        $user = $request->user();
        $submission = AssignmentSubmission::where('user_id', $user->id)
            ->where('assignment_id', $assignment->id)
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'No submission found.'], 404);
        }

        // Delete the file and the submission record
        Storage::delete($submission->file_path);
        $submission->delete();

        return response()->json(['message' => 'Submission deleted successfully.']);
    }
    public function viewSubmissions(Assignment $assignment)
{
    // Ensure the teacher is assigned to this course
    if ($assignment->course->teacher_id != Auth::id()) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $submissions = $assignment->submissions; // Eager load submissions
    return response()->json(['submissions' => $submissions]);
}
public function getSubmissions($assignmentId)
{
    // Retrieve the assignment
    $assignment = Assignment::find($assignmentId);

    // If the assignment doesn't exist, return an error response
    if (!$assignment) {
        return response()->json(['error' => 'Assignment not found'], 404);
    }

    // Fetch the submissions for the assignment
    $submissions = AssignmentSubmission::where('assignment_id', $assignmentId)->get();

    // Return the submissions in the response
    return response()->json(['submissions' => $submissions]);
}
    /**
     * Grade a specific submission.
     */
    public function gradeSubmission(Request $request, $assignmentId)
    {
        $request->validate([
            'submission_id' => 'required|exists:assignment_submissions,id',
            'grade' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string|max:1000',
        ]);

        
        $submission = AssignmentSubmission::where('assignment_id', $assignmentId)
            ->where('id', $request->input('submission_id'))
            ->first();

        if (!$submission) {
            return response()->json([
                'message' => 'Assignment Submission not found for this assignment.',
            ], 404);
        }

        // Update the submission with grade and feedback
        $submission->grade = $request->input('grade');
        $submission->feedback = $request->input('feedback');
        // $submission->graded_at = now();
        $submission->save();

        return response()->json([
            'message' => 'Grade submitted successfully.',
            'submission' => $submission,
        ]);
    }

}
