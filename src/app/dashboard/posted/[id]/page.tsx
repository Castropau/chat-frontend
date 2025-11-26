// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Image from "next/image";
// interface Goal {
//   id: number;
//   title: string;
//   category_name: string;
//   duration: string;
//   privacy: string;
//   post_image?: string | null;
//   profile_image?: string | null;
//   firstname: string;
//   lastname: string;
//   username: string;
//   reactionCount: number;
//   commentCount: number;
// }

// export default function GoalPage({ params }: { params: { id: string } }) {
//   const { id } = params; // ✅ just get it directly

//   const [goal, setGoal] = useState<Goal | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGoal = async () => {
//       try {
//         const res = await axios.get(`/api/posted/${id}`);
//         setGoal(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGoal();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading...</p>;
//   if (!goal) return <p className="p-4">Goal not found</p>;

//   return (
//     <div className="min-h-screen dark:bg-gray-900 dark:text-gray-100 p-4">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <Image
//               src={goal.profile_image || "/default-avatar.png"}
//               className="w-10 h-10 rounded-full border border-gray-700"
//               alt="Profile"
//             />
//             <div>
//               <p className="font-semibold">{goal.firstname} {goal.lastname}</p>
//               <p className="text-sm text-gray-400">@{goal.username}</p>
//             </div>
//           </div>
//           {/* Category and Duration on top-right */}
//           <div className="text-right text-gray-300">
//             <p>{goal.category_name}</p>
//             <p>{goal.duration}</p>
//           </div>
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-bold mb-2">{goal.title}</h1>

//         {/* Image (optional) */}
//         {goal.post_image && (
//           <Image
//             src={goal.post_image}
//             className="rounded-lg w-full mb-4 border border-gray-700"
//             alt="Goal"
//             width={500}    // provide width & height
//             height={300}   // adjust as needed
//           />
//         )}

//         {/* Privacy */}
//         <div className="text-gray-300 mb-3">
//           <p>Privacy: {goal.privacy}</p>
//         </div>

//         {/* Counters */}
//         <div className="flex gap-6 text-gray-300 font-medium mt-2">
//           <p>👍 {goal.reactionCount} reactions</p>
//           <p>💬 {goal.commentCount} comments</p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

// ----- Types -----
interface Goal {
  id: number;
  title: string;
  category_name: string;
  duration: string;
  privacy: string;
  post_image?: string | null;
  profile_image?: string | null;
  firstname: string;
  lastname: string;
  username: string;
  reactionCount: number;
  commentCount: number;
}

interface ApiError {
  error: string;
}

// ----- Component -----
export default function GoalPage() {
  const params = useParams();        // ✅ Get params from hook
  const id = params?.id as string;   // TypeScript cast
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchGoal = async () => {
      try {
        const res = await axios.get<Goal>(`/api/posted/${id}`);
        setGoal(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as ApiError;
          setError(data?.error || "Failed to fetch the goal data");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!goal) return <p className="p-4">Goal not found</p>;

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-gray-100 p-4 mt-22">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={goal.profile_image || "/default-avatar.png"}
              alt={`${goal.firstname} ${goal.lastname}`}
              className="w-10 h-10 rounded-full border border-gray-700"
              width={40}
              height={40}
            />
            <div>
              <p className="font-semibold">
                {goal.firstname} {goal.lastname}
              </p>
              <p className="text-sm text-gray-400">@{goal.username}</p>
            </div>
          </div>
          {/* Category and Duration */}
          <div className="text-right text-gray-300">
            <p>{goal.category_name}</p>
            <p>{goal.duration}</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">{goal.title}</h1>

        {/* Image */}
        {goal.post_image && (
          <Image
            src={goal.post_image}
            alt={goal.title || "Goal image"}
            className="rounded-lg w-full mb-4 border border-gray-700"
            width={500}
            height={300}
          />
        )}

        {/* Privacy */}
        <div className="text-gray-300 mb-3">
          <p>Privacy: {goal.privacy}</p>
        </div>

        {/* Counters */}
        <div className="flex gap-6 text-gray-300 font-medium mt-2">
          <p>👍 {goal.reactionCount} reactions</p>
          <p>💬 {goal.commentCount} comments</p>
        </div>
      </div>
    </div>
  );
}
