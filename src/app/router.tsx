import {
  NotFoundRoute,
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { z } from "zod";

import { NotFoundPage } from "@/components/not-found";
import type { AuthContextValue } from "@/features/auth/types";
import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { LeadsPage } from "@/features/leads/pages/leads-page";
import { NewLeadPage } from "@/features/leads/pages/new-lead-page";
import { LeadDetailsPage } from "@/features/leads/pages/lead-details-page";
import { AppLayout } from "@/layouts/app-layout";
import { PublicLayout } from "@/layouts/public-layout";

type RouterContext = {
  auth: AuthContextValue;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: ({ error }) => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h2 className="text-2xl font-semibold text-foreground">
        Algo deu errado
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "Erro inesperado. Recarregue a pagina ou tente novamente mais tarde."}
      </p>
    </div>
  ),
});

const loginLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: PublicLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => loginLayoutRoute,
  path: "/",
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: AppLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: DashboardPage,
});

const leadsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "leads",
  component: LeadsPage,
});

const newLeadRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "leads/novo",
  component: NewLeadPage,
});

const leadDetailsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "leads/$leadId",
  component: LeadDetailsPage,
});

const routeTree = rootRoute.addChildren([
  loginLayoutRoute.addChildren([loginRoute]),
  protectedRoute.addChildren([
    dashboardRoute,
    leadsRoute,
    newLeadRoute,
    leadDetailsRoute,
  ]),
]);

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
});

export const router = createRouter({
  routeTree,
  notFoundRoute,
  defaultPreload: "intent",
  context: {
    auth: {
      state: { status: "loading", user: null, token: null },
      isAuthenticated: false,
      isLoading: true,
      login: async () => {
        throw new Error("Auth provider não inicializado.");
      },
      logout: async () => {
        throw new Error("Auth provider não inicializado.");
      },
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function RootComponent() {
  return <Outlet />;
}
