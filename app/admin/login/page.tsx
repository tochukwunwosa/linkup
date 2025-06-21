import AdminLoginForm from "./adminLoginForm";


export default function Page() {
  return (
    <div className="relative bg-[url('/assets/images/a_picture_of_tech_event-6000x4000.webp')] bg-center bg-no-repeat bg-cover flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="inset-0 absolute top-0 bg-foreground/70 w-full"/>
      <div className="relative w-full max-w-sm">
        <AdminLoginForm />
      </div>
    </div>
  )
}
