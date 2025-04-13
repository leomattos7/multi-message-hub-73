
import React, { useState } from "react";
import { Facebook, Instagram, MessageSquare } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChannelBadge } from "@/components/ChannelBadge";

// Types for channel connections
interface ChannelConnection {
  id: string;
  type: "whatsapp" | "instagram" | "facebook";
  name: string;
  connected: boolean;
  status: "connected" | "disconnected" | "pending";
  lastSync?: string;
}

interface SocialConnectionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for channel connections
const mockChannelConnections: ChannelConnection[] = [
  {
    id: "whatsapp-1",
    type: "whatsapp",
    name: "WhatsApp Business",
    connected: false,
    status: "disconnected"
  },
  {
    id: "instagram-1",
    type: "instagram",
    name: "Instagram Direct",
    connected: true,
    status: "connected",
    lastSync: "2023-04-12T15:30:00Z"
  },
  {
    id: "facebook-1",
    type: "facebook",
    name: "Facebook Messenger",
    connected: false,
    status: "disconnected"
  }
];

export function SocialConnectionsDialog({ isOpen, onOpenChange }: SocialConnectionsDialogProps) {
  const [connections, setConnections] = useState<ChannelConnection[]>(mockChannelConnections);

  const handleConnect = (id: string) => {
    setConnections(
      connections.map(conn => 
        conn.id === id 
          ? { 
              ...conn, 
              connected: true, 
              status: "connected", 
              lastSync: new Date().toISOString() 
            } 
          : conn
      )
    );
  };

  const handleDisconnect = (id: string) => {
    setConnections(
      connections.map(conn => 
        conn.id === id 
          ? { 
              ...conn, 
              connected: false, 
              status: "disconnected", 
              lastSync: undefined 
            } 
          : conn
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Conexões com Canais</DialogTitle>
          <DialogDescription>
            Conecte-se com WhatsApp e redes sociais para gerenciar mensagens.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <ChannelBadge channel={connection.type} size="lg" />
                <div>
                  <h4 className="font-medium">{connection.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {connection.status === "connected" 
                      ? `Conectado (sincronizado ${connection.lastSync 
                          ? new Date(connection.lastSync).toLocaleDateString("pt-BR", { 
                              hour: "2-digit", 
                              minute: "2-digit" 
                            }) 
                          : ""})`
                      : "Desconectado"}
                  </p>
                </div>
              </div>
              
              <Button 
                variant={connection.connected ? "outline" : "default"} 
                onClick={() => connection.connected 
                  ? handleDisconnect(connection.id) 
                  : handleConnect(connection.id)
                }
                className={connection.connected ? "text-red-600 hover:text-red-700 hover:bg-red-50" : ""}
              >
                {connection.connected ? "Desconectar" : "Conectar"}
              </Button>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
