<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use App\Models\ProductEmbedding;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    /**
     * Handle the incoming RAG chat prompt.
     */
    public function __invoke(Request $request)
    {
        // 1. Validate the user input
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = $request->input('message');

        try {
            // 2. Generate the mathematical search vector for the user query
            $response = OpenAI::embeddings()->create([
                'model' => 'text-embedding-3-small', // 1536 dimensions
                'input' => $userMessage,
            ]);
            $queryEmbedding = $response->embeddings[0]->embedding;

            // 3. Format the array floats into a PostgreSQL vector string syntax format: [val1,val2,...]
            $vectorString = '[' . implode(',', $queryEmbedding) . ']';

            // 4. Perform the native Cosine Distance (<=>) search using raw query formatting
            // Grab the top 3 most relevant product data excerpts
            $matchedChunks = ProductEmbedding::query()
                ->select('chunk_text')
                ->orderByRaw('embedding <=> ?', [$vectorString])
                ->limit(3)
                ->get();

            // 5. Merge retrieved data into a cohesive text block for the LLM
            $context = $matchedChunks->pluck('chunk_text')->implode("\n\n");

            // 6. Execute Chat Completion with strict structural instructions
            $aiResponse = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'temperature' => 0.3, // Low temperature ensures accurate adherence to context parameters
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "You are an expert AI shopping assistant for our e-commerce store 'Peeble & Pine'. " .
                                     "Use ONLY the following matching product snippets to answer the customer's inquiry concisely. " .
                                     "Include pricing and stock levels if requested. If the answer cannot be confidently deduced " .
                                     "from the provided context, politely inform the user that you don't have that information on hand.\n\n" .
                                     "--- STORES PRODUCT DATA CONTEXT ---\n" . $context
                    ],
                    [
                        'role' => 'user',
                        'content' => $userMessage
                    ]
                ],
            ]);

            return response()->json([
                'reply' => $aiResponse->choices[0]->message->content,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Chatbot failure: ' . $e->getMessage());
            return response()->json([
                'reply' => 'I am sorry, I am experiencing technical difficulties exploring our database layout. Please try again soon.',
            ], 500);
        }
    }
}
