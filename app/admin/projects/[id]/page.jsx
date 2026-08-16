import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import Project from "@/models/Project.model";
import { connectDB } from "@/lib/databaseConnection";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }) {
  const { id } = await params;
  await connectDB();

  const project = await Project.findById(id).lean();

  if (!project) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader
        title={`Edit Project: ${project.title}`}
        description="Update project details, stone specifications, segment enum, location, and images."
      />
      <ProjectForm initialData={JSON.parse(JSON.stringify(project))} isEdit={true} />
    </>
  );
}
