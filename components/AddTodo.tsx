'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTodoActions } from '@/store/selectors/todoSelectors';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';

// 🔐 Schéma de validation Zod
const formSchema = z.object({
  title: z
    .string()
    .min(1, 'La tâche ne peut pas être vide')
    .max(200, 'Maximum 200 caractères')
    .trim(),
});

interface AddTodoProps {
  userId: string;
}

export function AddTodo({ userId }: AddTodoProps) {
  const { addTodo } = useTodoActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await addTodo(values.title, userId);
    form.reset();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Nouvelle tâche..."
                  disabled={isSubmitting}
                  {...field}
                  className="text-sm sm:text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ajout...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}