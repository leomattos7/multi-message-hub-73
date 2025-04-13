
import React, { useState } from "react";
import { Facebook, Instagram, MessageSquare, QrCode, ArrowLeft } from "lucide-react";
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
  configSteps?: string[];
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
    status: "disconnected",
    configSteps: [
      "Abra o WhatsApp no seu telefone",
      "Acesse Configurações > Dispositivos conectados",
      "Selecione 'Vincular dispositivo'",
      "Siga as instruções na tela para completar a conexão"
    ]
  },
  {
    id: "instagram-1",
    type: "instagram",
    name: "Instagram Direct",
    connected: true,
    status: "connected",
    lastSync: "2023-04-12T15:30:00Z",
    configSteps: [
      "Faça login na sua conta do Instagram",
      "Acesse as configurações do perfil",
      "Vá para 'Aplicativos e sites'",
      "Autorize a conexão com nossa plataforma"
    ]
  },
  {
    id: "facebook-1",
    type: "facebook",
    name: "Facebook Messenger",
    connected: false,
    status: "disconnected",
    configSteps: [
      "Acesse sua conta do Facebook",
      "Vá para Configurações > Negócios",
      "Selecione 'Integrações'",
      "Autorize nossa plataforma a acessar suas mensagens"
    ]
  }
];

export function SocialConnectionsDialog({ isOpen, onOpenChange }: SocialConnectionsDialogProps) {
  const [connections, setConnections] = useState<ChannelConnection[]>(mockChannelConnections);
  const [selectedChannel, setSelectedChannel] = useState<ChannelConnection | null>(null);

  const handleConnect = (id: string) => {
    setSelectedChannel(connections.find(conn => conn.id === id) || null);
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

  const handleConfirmConnection = () => {
    if (selectedChannel) {
      setConnections(
        connections.map(conn => 
          conn.id === selectedChannel.id 
            ? { 
                ...conn, 
                connected: true, 
                status: "connected", 
                lastSync: new Date().toISOString() 
              } 
            : conn
        )
      );
      setSelectedChannel(null);
    }
  };

  const handleBackToList = () => {
    setSelectedChannel(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {selectedChannel ? (
          // Channel configuration view
          <>
            <DialogHeader>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute left-4 top-4 p-2" 
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-center">Configurar {selectedChannel.name}</DialogTitle>
              <DialogDescription className="text-center">
                Siga os passos abaixo para conectar sua conta
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex justify-center mb-4">
                <ChannelBadge channel={selectedChannel.type} size="lg" showLabel={true} />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-3">Passos para conexão:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {selectedChannel.configSteps?.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 p-4 rounded-md inline-block">
                  <QrCode size={150} className="text-gray-800" />
                  <p className="text-xs text-center mt-2">Escaneie este código QR</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={handleBackToList}
                className="sm:flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmConnection}
                className="sm:flex-1"
              >
                Confirmar Conexão
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Channel list view
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
