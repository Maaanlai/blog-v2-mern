export const paths = {
  auth: {
    root: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    otp: "/auth/otp",
    terms: "/auth/terms",
    privacy: "/auth/privacy",
  },

  dashboard: {
    root: "/admin",
    home: "/admin/home",
    management: {
      root: "/admin/management",
      customers: {
        root: "/admin/management/customers",
        list: "/admin/management/customers/list",
        view: (customerId: string) =>
          `/admin/management/customers/${customerId}`,
      },
    },
    apps: {
      root: "/admin/apps",
      kanban: "/admin/apps/kanban",
    },
    widgets: {
      root: "/admin/widgets",
      metrics: "/admin/widgets/metrics",
      charts: "/admin/widgets/charts",
      tables: "/admin/widgets/tables",
    },
  },
};
