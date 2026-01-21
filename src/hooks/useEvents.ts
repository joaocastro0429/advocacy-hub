import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  case_id: string | null;
  client_id: string | null;
  title: string;
  event_type: string;
  event_date: string;
  event_time: string;
  location: string | null;
  description: string | null;
  reminder: boolean;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
  } | null;
  cases?: {
    case_number: string;
  } | null;
}

export type EventInput = Omit<Event, "id" | "created_at" | "updated_at" | "clients" | "cases">;

export function useEvents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ["events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          clients (name),
          cases (case_number)
        `)
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user,
  });

  const createEvent = useMutation({
    mutationFn: async (input: EventInput) => {
      const { data, error } = await supabase
        .from("events")
        .insert({ ...input, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Compromisso criado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao criar compromisso", description: error.message, variant: "destructive" });
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...input }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from("events")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Compromisso atualizado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar compromisso", description: error.message, variant: "destructive" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Compromisso excluído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir compromisso", description: error.message, variant: "destructive" });
    },
  });

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
