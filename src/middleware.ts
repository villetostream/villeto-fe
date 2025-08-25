import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PERMISSIONS, ROLE_PERMISSIONS, Permission } from './lib/permissions';

// Define route permissions mapping
const ROUTE_PERMISSIONS: Record<string, Permission> = {
    '/dashboard': PERMISSIONS.VIEW_DASHBOARD,
    '/dashboard/inbox': PERMISSIONS.VIEW_INBOX,
    '/dashboard/insights': PERMISSIONS.VIEW_INSIGHTS,
    '/dashboard/expenses': PERMISSIONS.VIEW_EXPENSES,
    '/dashboard/expenses/card-transactions': PERMISSIONS.VIEW_CARD_TRANSACTIONS,
    '/dashboard/expenses/reimbursements': PERMISSIONS.VIEW_REIMBURSEMENTS,
    '/dashboard/expenses/travel': PERMISSIONS.VIEW_TRAVEL_EXPENSES,
    '/dashboard/cards': PERMISSIONS.VIEW_CARDS,
    '/dashboard/spend-programs': PERMISSIONS.VIEW_SPEND_PROGRAMS,
    '/dashboard/procurement': PERMISSIONS.VIEW_PROCUREMENT,
    '/dashboard/bill-pay': PERMISSIONS.VIEW_BILL_PAY,
    '/dashboard/accounting': PERMISSIONS.VIEW_ACCOUNTING,
    '/dashboard/business-account': PERMISSIONS.VIEW_BUSINESS_ACCOUNT,
    '/dashboard/people': PERMISSIONS.VIEW_PEOPLE,
    '/dashboard/vendors': PERMISSIONS.VIEW_VENDORS,
    '/dashboard/settings': PERMISSIONS.VIEW_SETTINGS,
    '/dashboard/settings/expense-policy': PERMISSIONS.MANAGE_EXPENSE_POLICY,
    '/dashboard/settings/company-settings': PERMISSIONS.MANAGE_COMPANY_SETTINGS,
    '/dashboard/settings/entities': PERMISSIONS.MANAGE_ENTITIES,
    '/dashboard/settings/apps': PERMISSIONS.MANAGE_APPS,
    '/dashboard/settings/personal-settings': PERMISSIONS.MANAGE_PERSONAL_SETTINGS,
    '/dashboard/help': PERMISSIONS.VIEW_HELP,
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-storage')?.value;

    // Redirect to login if no token is present
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    type UserRole = keyof typeof ROLE_PERMISSIONS;
    let userRole: UserRole;
    try {
        const authState = JSON.parse(token);
        const user = authState.state?.user;

        if (!user || !user.role) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        userRole = user.role as UserRole;
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const pathname = request.nextUrl.pathname;
    const requiredPermission = ROUTE_PERMISSIONS[pathname];

    // Allow access to root if user has VIEW_DASHBOARD permission
    if (pathname === '/' && ROLE_PERMISSIONS[userRole].includes(PERMISSIONS.VIEW_DASHBOARD)) {
        return NextResponse.next();
    }

    console.log('User Role:', userRole);
    console.log('Required Permission for route', pathname, ':', requiredPermission);

    // Check if user has the required permission for the route
    if (!requiredPermission || !ROLE_PERMISSIONS[userRole].includes(requiredPermission)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!login|register|api|_next/static|_next/image|favicon.ico).*)'],
};