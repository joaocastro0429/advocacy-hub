import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Petition {
  id: string;
  user_id: string;
  title: string;
  process_number: string | null;
  client_name: string;
  type: string;
  status: string;
  content_summary: string | null;
  created_at?: string;
}

export type PetitionInput = Omit<Petition, "id" | "user_id" | "created_at">;

export function usePetitions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. BUSCAR TODAS AS PETIÇÕES DO USUÁRIO
  const { data: petitions, isLoading } = useQuery({
    queryKey: ["petitions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("petitions")
        .select("*")
        .eq("user_id", user?.id) // Garante que só puxa as suas
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Petition[];
    },
    enabled: !!user,
  });

  // 2. CRIAR NOVA PETIÇÃO
  const createPetition = useMutation({
    mutationFn: async (newPetition: PetitionInput) => {
      const { data, error } = await supabase
        .from("petitions")
        .insert([{ ...newPetition, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petitions"] });
      toast.success("Petição criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar petição: " + error.message);
    },
  });

  // 3. ATUALIZAR PETIÇÃO
  const updatePetition = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Petition> & { id: string }) => {
      const { data, error } = await supabase
        .from("petitions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petitions"] });
      toast.success("Petição atualizada!");
    },
  });

  // 4. DELETAR PETIÇÃO
  const deletePetition = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("petitions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petitions"] });
      toast.success("Petição removida.");
    },
  });

  return {
    petitions,
    isLoading,
    createPetition,
    updatePetition,
    deletePetition,
  };
}