import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import fs from 'fs';
import path from 'path';
import { RowDataPacket } from "mysql2/promise";

// Generate a random string for the image filename
const generateRandomString = (length: number): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// Define the image file type
interface ImageFile {
  name: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

// Validate the image file type (optional, you can add more formats if needed)
const isValidImage = (image: ImageFile): boolean => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const imageExtension = path.extname(image.name).toLowerCase();
  return allowedExtensions.includes(imageExtension);
};

export async function POST(request: Request) {
  try {
    // Step 1: Parse the form data (including image file)
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const duration = formData.get('duration') as string;
    const privacy = formData.get('privacy') as string;
    const imageFile = formData.get('image') as ImageFile; // Typecast to ImageFile

    // Step 2: Validate inputs
    if (!userId || !title || !category || !duration || !privacy) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Step 3: Handle image file upload (if present)
    let imagePath = "";
    if (imageFile && imageFile.size) {
      // Validate the image file type
      if (!isValidImage(imageFile)) {
        return NextResponse.json({ error: "Invalid image format. Only JPG, JPEG, PNG, and GIF are allowed." }, { status: 400 });
      }

      // Generate random file name
      const randomString = generateRandomString(10); // Random string length can be adjusted
      const imageExtension = path.extname(imageFile.name);
      const newImageName = `${randomString}${imageExtension}`;
      imagePath = path.join(process.cwd(), 'public/images', newImageName);

      // Save the image file to the 'public/images' directory
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      fs.writeFileSync(imagePath, buffer);

      // Store the relative path for the image
      imagePath = `/images/${newImageName}`;
    }

    // Step 4: Insert goal data into the database
    const pool = getPool();
    await pool.execute(
      "INSERT INTO goals (user_id, title, category, duration, privacy, post_image) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, title, category, duration, privacy, imagePath]
    );

    // Step 5: Return success response
    return NextResponse.json({ message: "Goal created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Goal creation error:", error);
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 });
  }
}
interface GoalRow extends RowDataPacket {
  id: number;
  title: string;
  category: string;
  duration: string;
  privacy: string;
  user_id: number;
  created_at: Date;
  post_image: string | null;
  user_name: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  category_names: string;
}
// GET request for fetching goals
export async function GET() {
  try {
    const pool = getPool();
    
    // Query to fetch specific columns from the `goals` table
    const [rows] = await pool.execute<GoalRow[]>(
      `
      SELECT 
        goals.id, 
        goals.title, 
        goals.category, 
        goals.duration, 
        goals.privacy, 
        goals.user_id, 
        goals.created_at,
        goals.post_image,
        users.username AS user_name,
        users.firstname AS user_firstname,
        users.lastname AS user_lastname, 
        users.email AS user_email,
        users.id as user_id,
        categories.category_name AS category_names
      FROM goals
      JOIN categories ON goals.category = categories.category_id
      JOIN users ON goals.user_id = users.id
      ORDER BY goals.created_at DESC
      `
    );

    // If no goals found, return an empty response
    if (rows.length === 0) {
      return NextResponse.json({ message: "No goals found" }, { status: 200 });
    }

    // Return the fetched rows (goals)
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Internal server error while fetching goals" }, { status: 500 });
  }
}
