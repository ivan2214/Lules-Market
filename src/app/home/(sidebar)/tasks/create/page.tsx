import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";
import { Page, PageTitleBar } from "@/shared/components/page";
import { CreateTaskForm } from "@/shared/components/tasks/create-task-form";

function CreateTaskPage() {
  return (
    <Page>
      <PageTitleBar title="Create Task" description="Create a new task" />
      <CreateTaskForm />
    </Page>
  );
}

export default withAuthenticate(CreateTaskPage);
