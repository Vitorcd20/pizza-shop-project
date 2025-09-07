import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signInForm = z.object({
  email: z.string().email(),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>();

  async function handleSignIn(data: SignInForm) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("An authentication link will be sent to your email.", {
        action: {
          label: "Reenviar",
          onClick: () => {
            handleSignIn(data);
          },
        },
      });
    } catch (error) {
      toast.error("Invalid Credentials.");
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant="ghost" asChild>
          <Link to="/sign-up" className="absolute right-8 top-8">
            New bussines
          </Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Access dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your sales through the partner dashboard!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Your e-mail</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Access dashboard
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
