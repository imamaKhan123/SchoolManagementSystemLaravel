<?php

namespace App\Http\Controllers;
use App\Models\Documents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class DocumentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        //
    }
        /**
         * Delete a specific document by its ID.
         */
        public function destroy($id)
        {
            // Find the document by ID
            $document = Documents::find($id);
    
            // Check if the document exists
            if (!$document) {
                return response()->json(['message' => 'Document not found'], 404);
            }
    
            // Delete the file from storage
            if ($document->file_path && Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }
    
            // Delete the record from the database
            $document->delete();
    
            return response()->json(['message' => 'Document deleted successfully'], 200);
        }
    
}
