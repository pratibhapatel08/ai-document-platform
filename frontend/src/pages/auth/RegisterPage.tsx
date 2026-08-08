import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout";
import { ErrorMessage } from "@/components/common";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/context";
import { ROUTES } from "@/lib/constants";
import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth.schema";
import { getHomeRoute } from "@/routes/RouteGuards";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setError(null);

    try {
      const user = await registerUser(values);
      navigate(getHomeRoute(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start managing documents with AI insights">
      <form className="space-y-4" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        {error ? <ErrorMessage message={error} className="text-left" /> : null}

        <Input
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};
