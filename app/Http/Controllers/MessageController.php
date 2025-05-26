<?php

namespace App\Http\Controllers;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        Message::create($data);

        return response()->json(['message' => 'Message sent successfully']);
    }

    // public function index(Request $request)
    // {
    //     // Validate the incoming request data
    //     $data = $request->validate([
    //         'sender_id' => 'required|exists:users,id',
    //         'receiver_id' => 'required|exists:users,id',
    //     ]);
    
    //     // Fetch messages for the given sender and receiver
    //     $messages = Message::where(function ($query) use ($data) {
    //         // Messages sent by the user to the receiver
    //         $query->where('sender_id', $data['sender_id'])
    //               ->where('receiver_id', $data['receiver_id']);
    //     })
    //     ->orWhere(function ($query) use ($data) {
    //         // Messages received by the user from the sender
    //         $query->where('sender_id', $data['receiver_id'])
    //               ->where('receiver_id', $data['sender_id']);
    //     })
    //     ->with('sender') // Load sender details
    //     ->orderBy('created_at', 'asc') // Oldest to newest
    //     ->get();
    //     // Map the messages to include sender details
    //     $messages = $messages->map(function ($message) {
    //         return [
    //             'id' => $message->id,
    //             'message' => $message->message,
    //             'sender_name' => $message->sender->name, // Add the sender's name
    //             'sender_email' => $message->sender->email, // Add the sender's email
    //             'created_at' => $message->created_at->toDateTimeString(),
    //         ];
    //     });
    
    //     return response()->json($messages);
    // }
    
    public function index(Request $request)
    {
        // Validate the incoming request
        $data = $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
        ]);
    
        // Fetch messages between sender and receiver (both directions)
        $messages = Message::where(function ($query) use ($data) {
            $query->where('sender_id', $data['sender_id'])
                  ->where('receiver_id', $data['receiver_id']);
        })
        ->orWhere(function ($query) use ($data) {
            $query->where('sender_id', $data['receiver_id'])
                  ->where('receiver_id', $data['sender_id']);
        })
        ->with('sender') // Eager load sender relationship
        ->orderBy('created_at', 'asc')
        ->get();
    
        // Debugging: Log messages to verify query results
        if ($messages->isEmpty()) {
            return response()->json([
                'error' => 'No messages found for the given sender and receiver IDs.',
                'sender_id' => $data['sender_id'],
                'receiver_id' => $data['receiver_id']
            ], 404);
        }
    
        // Map messages to include relevant details
        $mappedMessages = $messages->map(function ($message) {
            return [
                'id' => $message->id,
                'message' => $message->message,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'sender_name' => optional($message->sender)->name, // Use optional() to avoid errors
                'sender_email' => optional($message->sender)->email,
                'created_at' => $message->created_at->format('Y-m-d H:i:s'), // Format date for consistency
            ];
        });
    
        // Return the messages as JSON
        return response()->json($mappedMessages);
    }
    
    
    
}
