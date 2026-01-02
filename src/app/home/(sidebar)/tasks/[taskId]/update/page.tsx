import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/orpc";
import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";
import { Page, PageTitleBar } from "@/shared/components/page";
import { DeleteTasksDialog } from "@/shared/components/tasks/delete-tasks-dialog";
import { UpdateTaskForm } from "@/shared/components/tasks/update-task-form";
import { Button } from "@/shared/components/ui/button";

async function UpdateTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  const data = await client.tasks.get({ id: taskId });

  if (!data) {
    notFound();
  }

  return (
    <Page>
      <PageTitleBar title={data.code} description={"Task Details"}>
        <Link href="/home/tasks">
          <Button variant="outline">Back</Button>
        </Link>
        <DeleteTasksDialog tasks={[data]}>
          <Button variant="destructive">Delete</Button>
        </DeleteTasksDialog>
      </PageTitleBar>
      <UpdateTaskForm task={data} />
    </Page>
  );
}

export default withAuthenticate(UpdateTaskPage);
