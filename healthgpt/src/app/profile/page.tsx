import { auth } from "@clerk/nextjs/server"; // ✅ correct import for app directory


export default async function ProfilePage() {
  const { userId } = await auth();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-2">🙍 Your Profile</h2>
      <p className="text-muted-foreground">Logged in as user ID: {userId}</p>
    </div>
  );
}
