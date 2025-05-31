"use client";

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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { loginSchema, LoginSchema } from "@/lib/validations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import DatePicker from "@/components/ui/date-picker";
import { SetStateAction } from "react";
import { fetchClasses } from "@/app/actions/students";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      class: undefined,
      id: "",
      birth_date: "",
    },
  });
  const router = useRouter();
  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const classes = await fetchClasses();

      return classes;
    },
  });

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
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/images/logo-eeaa.png"
              alt="Logo EEAA"
              width={60}
              height={60}
              priority
            />
          </div>
          <CardTitle className="text-3xl text-center">
            Bem-vindo de volta!
          </CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={status === "loading"}
                                className="w-full justify-between text-muted-foreground"
                              >
                                {field.value || field.value === 0
                                  ? classes.find(
                                      (classItem) =>
                                        classItem.index === field.value
                                    )?.title
                                  : "Selecione a turma"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Selecionar turma..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Nenhuma turma encontrada
                                </CommandEmpty>
                                <CommandGroup>
                                  {classes.map((classItem) => (
                                    <CommandItem
                                      value={classItem.index.toString()}
                                      key={classItem.index}
                                      onSelect={() => {
                                        form.setValue("class", classItem.index);
                                      }}
                                    >
                                      {classItem.title}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          classItem.index === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button
                  className="bg-[#168a43] w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Entrar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
