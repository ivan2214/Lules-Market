import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
/* revalidar cada 30 minutos */
export const revalidate = 1800;

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  console.log(userId);

  const cookieStore = await cookies();
  const _sessionToken = cookieStore
    .get("better-auth.session_token")
    ?.value.split(".")[0];

  /*  const { sessions } = await auth.api.listUserSessions({
    body: {
      userId,
    },
    headers: await headers(),
  }); */

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="w-full max-w-xl">
        {/*   <UserSessions
          sessions={sessions}
          sessionId={sessionToken ?? ""}
          userId={userId}
        /> */}
      </div>
    </div>
  );
}
