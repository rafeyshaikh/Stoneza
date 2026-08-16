import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProjectTable from "@/components/admin/projects/ProjectTable";
import Project from "@/models/Project.model";
import { connectDB } from "@/lib/databaseConnection";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await connectDB();
  const projects = await Project.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title="Projects CMS"
        description="Manage showcase projects, segments, stone specifications, location details, and applications."
        actionLabel="Add Project"
        onAction="/admin/projects/new"
      />
      <ProjectTable initialProjects={JSON.parse(JSON.stringify(projects))} />
    </>
  );
}
