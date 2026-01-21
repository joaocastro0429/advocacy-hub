import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Case {
  id: string;
  client_id: string;
  case_number: string;
  case_type: string;
  court: string | null;
  judge: string | null;
  subject: string | null;
  status: string;
  value: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
  };
}

export type CaseInput = Omit<Case, "id" | "created_at" | "updated_at" | "clients">;

export function useCases() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cases = [], isLoading, error } = useQuery({
    queryKey: ["cases", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          clients (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Case[];
    },
    enabled: !!user,
  });

  const createCase = useMutation({
    mutationFn: async (input: CaseInput) => {
      const { data, error } = await supabase
        .from("cases")
        .insert({ ...input, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({ title: "Processo criado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao criar processo", description: error.message, variant: "destructive" });
    },
  });

  const updateCase = useMutation({
    mutationFn: async ({ id, ...input }: Partial<Case> & { id: string }) => {
      const { data, error } = await supabase
        .from("cases")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({ title: "Processo atualizado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar processo", description: error.message, variant: "destructive" });
    },
  });

  const deleteCase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({ title: "Processo excluído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir processo", description: error.message, variant: "destructive" });
    },
  });

  return {
    cases,
    isLoading,
    error,
    createCase,
    updateCase,
    deleteCase,
  };
}
