import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEvents, EventInput } from "@/hooks/useEvents";
import { useClients } from "@/hooks/useClients";
import { useCases } from "@/hooks/useCases";
import { cn } from "@/lib/utils";

const eventTypeConfig = {
  audiencia: { label: "Audiência", color: "bg-accent" },
  reuniao: { label: "Reunião", color: "bg-primary" },
  prazo: { label: "Prazo", color: "bg-destructive" },
  outros: { label: "Outros", color: "bg-muted-foreground" },
};

export default function Agenda() {
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useEvents();
  const { clients } = useClients();
  const { cases } = useCases();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventInput>({
    case_id: null,
    client_id: null,
    title: "",
    event_type: "reuniao",
    event_date: "",
    event_time: "",
    location: null,
    description: null,
    reminder: true,
  });

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.clients?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (event?: typeof events[0]) => {
    if (event) {
      setEditingEvent(event.id);
      setFormData({
        case_id: event.case_id,
        client_id: event.client_id,
        title: event.title,
        event_type: event.event_type,
        event_date: event.event_date,
        event_time: event.event_time,
        location: event.location,
        description: event.description,
        reminder: event.reminder,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        case_id: null,
        client_id: null,
        title: "",
        event_type: "reuniao",
        event_date: "",
        event_time: "",
        location: null,
        description: null,
        reminder: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      await updateEvent.mutateAsync({ id: editingEvent, ...formData });
    } else {
      await createEvent.mutateAsync(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este compromisso?")) {
      await deleteEvent.mutateAsync(id);
    }
  };

  const formatEventDate = (date: string) => {
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return date;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Agenda</h1>
            <p className="text-muted-foreground">Gerencie seus compromissos e prazos</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Compromisso
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar compromissos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-card rounded-xl p-8 text-center text-muted-foreground shadow-card">
              Carregando...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-card rounded-xl p-12 text-center shadow-card">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-2">Nenhum compromisso encontrado</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {search ? "Tente uma busca diferente" : "Comece adicionando seu primeiro compromisso"}
              </p>
              {!search && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Compromisso
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-xl shadow-card divide-y divide-border">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 hover:bg-secondary/50 transition-colors flex items-start gap-4"
                >
                  <div
                    className={cn(
                      "w-1 h-full min-h-[60px] rounded-full",
                      eventTypeConfig[event.event_type as keyof typeof eventTypeConfig]?.color || "bg-muted"
                    )}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {eventTypeConfig[event.event_type as keyof typeof eventTypeConfig]?.label || event.event_type}
                      </Badge>
                    </div>
                    {event.clients && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Cliente: {event.clients.name}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatEventDate(event.event_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.event_time}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(event)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Editar Compromisso" : "Novo Compromisso"}</DialogTitle>
            <DialogDescription>Preencha os dados do compromisso abaixo</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Tipo *</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audiencia">Audiência</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="prazo">Prazo</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente</Label>
                <Select
                  value={formData.client_id || "none"}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Data *</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_time">Horário *</Label>
                <Input
                  id="event_time"
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="case_id">Processo Vinculado</Label>
                <Select
                  value={formData.case_id || "none"}
                  onValueChange={(value) => setFormData({ ...formData, case_id: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o processo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.case_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending}>
                {editingEvent ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
