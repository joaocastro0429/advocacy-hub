import { Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  type: "audiencia" | "reuniao" | "prazo";
  date: string;
  time: string;
  location?: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Audiência - Maria Santos",
    type: "audiencia",
    date: "Hoje",
    time: "14:00",
    location: "2ª Vara do Trabalho",
  },
  {
    id: "2",
    title: "Reunião com cliente",
    type: "reuniao",
    date: "Hoje",
    time: "16:30",
    location: "Escritório",
  },
  {
    id: "3",
    title: "Prazo: Contestação",
    type: "prazo",
    date: "Amanhã",
    time: "23:59",
  },
  {
    id: "4",
    title: "Audiência - João Oliveira",
    type: "audiencia",
    date: "23/01",
    time: "10:00",
    location: "5ª Vara Cível",
  },
];

const typeConfig = {
  audiencia: {
    color: "bg-accent",
  },
  reuniao: {
    color: "bg-primary",
  },
  prazo: {
    color: "bg-destructive",
  },
};

export function UpcomingEvents() {
  const navigate = useNavigate();
  return (
    <div className="bg-card rounded-xl shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-semibold">Próximos Compromissos</h2>
            <p className="text-sm text-muted-foreground">Sua agenda da semana</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {mockEvents.map((event, index) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => navigate("/calendar")} // Dica: Clicar no evento também pode levar à agenda
          >
            <div
              className={`w-1 h-full min-h-[60px] rounded-full ${typeConfig[event.type].color}`}
            />
            <div className="flex-1">
              <p className="font-medium">{event.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {event.date}, {event.time}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 pt-0">
        {/* 3. Adicione o onClick chamando a rota da sua agenda */}
        <button 
          onClick={() => navigate("/Agenda")} 
          className="w-full py-2 text-sm font-medium text-accent hover:bg-accent/5 rounded-lg transition-colors"
        >
          Ver agenda completa
        </button>
      </div>
    </div>
  );
}
