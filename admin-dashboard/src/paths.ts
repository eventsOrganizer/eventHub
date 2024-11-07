export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: "/dashboard",
    account: "/dashboard/account",
    customers: "/dashboard/customers",
    complaints: "/dashboard/complaints",
    settings: "/dashboard/settings",
    services: "/dashboard/services",
    events: "/dashboard/events"
  },
  errors: { notFound: '/errors/not-found' },
} as const;
