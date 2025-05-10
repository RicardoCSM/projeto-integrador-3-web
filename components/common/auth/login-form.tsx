import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { loginSchema, LoginSchema } from "@/lib/validations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import DatePicker from "@/components/ui/date-picker";
import { SetStateAction } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: "",
      birth_date: "",
    },
  });
  const router = useRouter();

  const { mutateAsync, status } = useMutation({
    mutationFn: login,
    onSuccess: (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: LoginSchema) {
    mutateAsync(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de matrícula</FormLabel>
                      <FormControl>
                        <Input
                          disabled={status === "loading"}
                          className="p-5"
                          placeholder="Digite aqui"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <DatePicker
                          disabled={status === "loading"}
                          error={form.formState.errors.birth_date}
                          date={field.value ? new Date(field.value) : undefined}
                          setDate={(date: SetStateAction<Date | undefined>) => {
                            if (date instanceof Date) {
                              field.onChange(date.toISOString());
                            } else {
                              field.onChange("");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" disabled={status === "loading"}>
                  {status === "loading" && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Entrar
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Não consegue acessar sua conta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Suporte
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
