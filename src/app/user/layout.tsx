

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full min-h-screen">
        {children}
    </div>
  )
}
