import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getRouteConfig } from '@/config/routes';
import { UserProfile } from '@/types/auth';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user profile if authenticated
  let profile: UserProfile | null = null;
  if (user) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile in middleware:', error);
        // If there's an error fetching profile, treat as non-member with no role
        profile = null;
      } else {
        profile = data;
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      profile = null;
    }
  }

  const path = request.nextUrl.pathname;
  const routeConfig = getRouteConfig(path);

  // Debug logging
  console.log('🔐 Middleware Check:', {
    path,
    user: user?.email,
    profile: profile ? {
      member: profile.member,
      role: profile.role
    } : null,
    routeConfig: routeConfig ? {
      requireAuth: routeConfig.requireAuth,
      requireMember: routeConfig.requireMember,
      requireNonMember: routeConfig.requireNonMember,
      allowedRoles: routeConfig.allowedRoles
    } : null
  });

  // If no specific route config, allow access
  if (!routeConfig) {
    console.log('✅ No route config found, allowing access');
    return response;
  }

  // Check authentication requirement
  if (routeConfig.requireAuth && !user) {
    console.log('🚫 Authentication required but user not logged in');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is authenticated, check authorization
  if (user) {
    // Check if route is for non-members only (become-member routes)
    if (routeConfig.requireNonMember === true) {
      if (profile && profile.member) {
        console.log('🚫 Route is for non-members only but user is a member');
        const url = new URL('/unauthorized', request.url);
        url.searchParams.set('from', path);
        return NextResponse.redirect(url);
      }
    }
    
    // Check membership requirement
    if (routeConfig.requireMember === true) {
      // If no profile or not a member, redirect to unauthorized
      if (!profile || !profile.member) {
        console.log('🚫 Membership required but user is not a member');
        const url = new URL('/unauthorized', request.url);
        url.searchParams.set('from', path);
        return NextResponse.redirect(url);
      }
    }

    // Check role requirement
    if (routeConfig.allowedRoles && routeConfig.allowedRoles.length > 0) {
      // If no profile or doesn't have required role, redirect to unauthorized
      if (!profile || !routeConfig.allowedRoles.includes(profile.role)) {
        console.log('🚫 Role required but user lacks permission', {
          requiredRoles: routeConfig.allowedRoles,
          userRole: profile?.role
        });
        const url = new URL('/unauthorized', request.url);
        url.searchParams.set('from', path);
        return NextResponse.redirect(url);
      }
    }
  }

  console.log('✅ Access granted');

  // Redirect authenticated users away from login page
  if (user && path === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};