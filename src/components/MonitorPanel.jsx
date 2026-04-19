import { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';

export default function MonitorPanel() {
  const [logs, setLogs] = useState([]);
  const channelRef = useRef(null);

  useEffect(() => {
    const fetchInitialLogs = async () => {
      const { data, error } = await supabase
        .from('ping_logs')
        .select('*, sites(name, url)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) setLogs(data);
      if (error) console.error('Erro ao buscar logs:', error);
    };

    fetchInitialLogs();

    // Evita criar canal duplicado
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel('monitoramento-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ping_logs' },
        (payload) => {
          console.log('Novo log:', payload.new);
          // Adiciona o novo log no topo sem refetch
          setLogs((prev) => [payload.new, ...prev].slice(0, 10));
        }
      )
      .subscribe((status) => {
        console.log('Status do canal:', status);
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return (
    <div>Seu código de interface aqui</div>
  );
}