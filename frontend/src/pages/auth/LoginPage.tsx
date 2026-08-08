import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout";
import { ErrorMessage } from "@/components/common";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/context";
import { ROUTES } from "@/lib/constants";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth.schema";
import { getHomeRoute } from "@/routes/RouteGuards";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setError(null);

    try {
      const user = await login(values);
      navigate(getHomeRoute(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your documents">
      <form className="space-y-4" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        {error ? <ErrorMessage message={error} className="text-left" /> : null}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to={ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};
