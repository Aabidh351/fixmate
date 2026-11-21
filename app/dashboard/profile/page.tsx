
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-3xl my-10 sm:my-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#142B3A]">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your personal information and contact details.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProfileForm
          name={user.name || ""}
          email={user.email || ""}
          phone={user.phone || ""}
          area={user.area || ""}
          bio={user.bio || ""}
        />
      </div>
    </div>
  );
}
