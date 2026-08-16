import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Add New Project"
        description="Create a new project entry with segment enum, stone specifications, location, and gallery images."
      />
      <ProjectForm isEdit={false} />
    </>
  );
}
