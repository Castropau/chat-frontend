// api/categories.js or wherever you want to put your API handler

import { getPool } from "@/lib/database/db";

// import { getPool } from './db'; // Import the getPool function

export async function GET() {
  try {
    const pool = await getPool(); // Get the pool instance

    // Query categories sorted by category name
    const [rows] = await pool.query(
      'SELECT category_name, category_id FROM categories ORDER BY category_name ASC'
    );

    // Respond with the fetched categories
    return new Response(JSON.stringify(rows), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging

    // Respond with an error message if the query fails
    return new Response(
      JSON.stringify({ error: 'Failed to fetch categories' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
