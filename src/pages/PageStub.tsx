/** Temporary page shell used while real pages are built phase by phase. */
export const PageStub = ({ title }: { title: string }) => (
  <div className="flex min-h-[60vh] items-center justify-center bg-offwhite pt-16">
    <h1 className="font-heading text-3xl font-bold text-navy-deep md:text-5xl">{title}</h1>
  </div>
)
