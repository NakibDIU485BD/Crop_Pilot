import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROLE_HOME } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: ({ context }) => {
    throw redirect({ to: ROLE_HOME[context.role], replace: true });
  },
});
