'use client'

import { usePathname } from 'next/navigation'

export function NavbarVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide Navbar on login page, reset-password page, and auth error page
  const hiddenPaths = ['/login', '/reset-password', '/auth/auth-code-error', '/register']
  
  if (pathname && hiddenPaths.includes(pathname)) {
    return null
  }

  return <>{children}</>
}
