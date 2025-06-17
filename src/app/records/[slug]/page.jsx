import DataTableAttendance from "@/Components/DataTableAttendance";

export default async function AttendancePage({ params }) {
  const slug = params.slug;
  console.log("slug: ", slug);

  return (
    <div className="w-full h-lvh flex items-center justify-center">
      <DataTableAttendance userid={slug} />
    </div>
  );
}
