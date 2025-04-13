
import React, { useState } from "react";
import { Facebook, Instagram, MessageSquare, QrCode, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChannelBadge } from "@/components/ChannelBadge";
import { useToast } from "@/hooks/use-toast";

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
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<ChannelConnection | null>(null);
  const { toast } = useToast();

  const handleConnect = (connection: ChannelConnection) => {
    setCurrentConnection(connection);
    setShowQrDialog(true);
  };

  const handleQrSuccess = () => {
    if (currentConnection) {
      setConnections(
        connections.map(conn => 
          conn.id === currentConnection.id 
            ? { 
                ...conn, 
                connected: true, 
                status: "connected", 
                lastSync: new Date().toISOString() 
              } 
            : conn
        )
      );
      setShowQrDialog(false);
      toast({
        title: "Conexão realizada com sucesso!",
        description: `${currentConnection.name} conectado com sucesso.`,
      });
    }
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
    toast({
      title: "Desconectado",
      description: "Canal desconectado com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <>
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
                    : handleConnect(connection)
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

      <AlertDialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {currentConnection && (
                  <ChannelBadge channel={currentConnection.type} size="sm" />
                )}
                Escaneie o QR Code para conectar
              </span>
              <DialogClose className="rounded-full h-6 w-6 flex items-center justify-center" onClick={() => setShowQrDialog(false)}>
                <X className="h-4 w-4" />
              </DialogClose>
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="border border-gray-200 p-4 rounded-md mb-4">
              <QrCode className="h-48 w-48 text-gray-800" />
            </div>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Abra o aplicativo{' '}
              {currentConnection?.type === 'whatsapp' && 'WhatsApp'}
              {currentConnection?.type === 'instagram' && 'Instagram'}
              {currentConnection?.type === 'facebook' && 'Messenger'}{' '}
              no seu celular e escaneie este código QR para conectar sua conta.
            </p>
          </div>
          
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowQrDialog(false)}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleQrSuccess}
            >
              Confirmar Conexão
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
