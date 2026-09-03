<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\DB;

class ProductSearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = $request->input('q');
        
        if (empty($query)) {
            return response()->json([]);
        }

        // 1. Generate the AI Vector for Semantic Search
        $response = OpenAI::embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $query,
        ]);
        $queryEmbedding = $response->embeddings[0]->embedding;
        $vectorString = '[' . implode(',', $queryEmbedding) . ']';

        // 2. Execute a Single-Pass Hybrid Search in PostgreSQL
        // We combine Full-Text Keyword Ranking (ts_rank) with Vector Closeness (<=>)
        // Wrapped in a subquery since Postgres won't resolve SELECT-list aliases inside a combined ORDER BY expression
        $products = DB::select("
            SELECT * FROM (
                SELECT p.*,
                    -- Keyword Match Score (Higher is better, normalized between 0 and 1)
                    ts_rank(to_tsvector('english', p.name || ' ' || p.description), plainto_tsquery('english', :keyword_query)) as keyword_score,

                    -- Vector Distance Score (Lower distance means a closer semantic match, inverted here so higher is better)
                    (1 - (pe.embedding <=> :vector_query::vector)) as semantic_score
                FROM products p
                JOIN product_embeddings pe ON p.id = pe.product_id
                WHERE
                    -- Match either keyword index OR semantic threshold
                    to_tsvector('english', p.name || ' ' || p.description) @@ plainto_tsquery('english', :keyword_query)
                    OR (pe.embedding <=> :vector_query::vector) < 0.4
            ) AS matches
            -- Order by a balanced weighted combination of both strategies
            ORDER BY ((keyword_score * 0.5) + (semantic_score * 0.5)) DESC
            LIMIT 12
        ", [
            'keyword_query' => $query,
            'vector_query' => $vectorString
        ]);

        return response()->json($products);
    }
}