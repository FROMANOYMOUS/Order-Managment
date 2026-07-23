import React, { useState } from 'react';
import { Order } from '../types';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send, 
  Phone, 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Package, 
  Truck, 
  Database, 
  Layers 
} from 'lucide-react';

interface WhatsAppQueueViewProps {
  orders: Order[];
  onConfirmWhatsAppOrder: (order: Order) => void;
  onSimulateIncomingOrder: (sample: {
    customerName: string;
    phone: string;
    artworkTitle: string;
    amount: number;
    address: string;
    city: string;
    messageText: string;
  }) => void;
  isDarkMode: boolean;
}

export const WhatsAppQueueView: React.FC<WhatsAppQueueViewProps> = ({
  orders,
  onConfirmWhatsAppOrder,
  onSimulateIncomingOrder,
  isDarkMode
}) => {
  const [queueTab, setQueueTab] = useState<'unconfirmed' | 'confirmed' | 'integration_guide'>('unconfirmed');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Simulation form state
  const [simName, setSimName] = useState<string>('Radhika Apte');
  const [simPhone, setSimPhone] = useState<string>('+91 98201 55432');
  const [simTitle, setSimTitle] = useState<string>('Royal Elephant Heritage Gold Foil Triptych');
  const [simAmount, setSimAmount] = useState<number>(50400);
  const [simAddress, setSimAddress] = useState<string>('Flat 302, Sea Crest Towers, Worli');
  const [simCity, setSimCity] = useState<string>('Mumbai');
  const [simText, setSimText] = useState<string>(
    'Hi Rutuja! Ordering Royal Elephant Gold Foil Triptych. Paid ₹50,400 on UPI (GPay Ref: 8910239401). Please confirm my order!'
  );

  const unconfirmedOrders = orders.filter(
    o => o.orderConfirmationStatus === 'Unconfirmed' || (o.whatsappDetails && !o.whatsappDetails.sentConfirmationAt)
  );

  const confirmedOrders = orders.filter(
    o => o.orderConfirmationStatus === 'Confirmed' || (o.whatsappDetails && Boolean(o.whatsappDetails.sentConfirmationAt))
  );

  const displayedList = (queueTab === 'unconfirmed' ? unconfirmedOrders : confirmedOrders).filter(o => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      (o.whatsappDetails?.rawMessage && o.whatsappDetails.rawMessage.toLowerCase().includes(q))
    );
  });

  const handleCopyCode = (codeText: string, codeId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulateIncomingOrder({
      customerName: simName,
      phone: simPhone,
      artworkTitle: simTitle,
      amount: Number(simAmount),
      address: simAddress,
      city: simCity,
      messageText: simText
    });
    setIsSimulateModalOpen(false);
  };

  // SQL & Supabase edge function snippets
  const supabaseTableSql = `-- Create incoming WhatsApp messages table in Supabase
CREATE TABLE IF NOT EXISTS public.whatsapp_incoming_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_phone VARCHAR(50) NOT NULL,
  sender_name VARCHAR(250),
  message_body TEXT,
  whatsapp_msg_id VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'UNCONFIRMED', -- UNCONFIRMED, CONFIRMED
  tracking_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policy enabling public webhook inserts & admin select
ALTER TABLE public.whatsapp_incoming_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public webhook insert" ON public.whatsapp_incoming_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read" ON public.whatsapp_incoming_messages FOR SELECT USING (true);`;

  const edgeFunctionCode = `// Supabase Edge Function: /supabase/functions/whatsapp-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "GET") {
    // Meta WhatsApp Cloud API Webhook Verification
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === "RUTUJA_ART_VERIFY_TOKEN") {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // Parse incoming WhatsApp message payload from Meta or Twilio
  const payload = await req.json();
  const entry = payload.entry?.[0]?.changes?.[0]?.value;
  const message = entry?.messages?.[0];

  if (message) {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Save message into unconfirmed queue
    await supabase.from("whatsapp_incoming_messages").insert({
      sender_phone: message.from,
      sender_name: entry?.contacts?.[0]?.profile?.name || "WhatsApp Customer",
      message_body: message.text?.body || "",
      whatsapp_msg_id: message.id,
      status: "UNCONFIRMED"
    });
  }

  return new Response(JSON.stringify({ status: "success" }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});`;

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      {/* Top Banner Header */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                WhatsApp Unconfirmed Order Queue & Dispatch Engine
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Supabase Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Incoming WhatsApp messages are held in this queue. Review payment & address details, then confirm to automatically send the customer their tracking ID.
            </p>
          </div>
        </div>

        {/* Action Button: Simulate incoming WhatsApp Order */}
        <button
          onClick={() => setIsSimulateModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Incoming WhatsApp Message</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Unconfirmed Orders Queue</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {unconfirmedOrders.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Awaiting owner review & confirmation</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Confirmed & Dispatched</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {confirmedOrders.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">WhatsApp tracking alerts sent to customers</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Unconfirmed Queue Value</p>
            <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              ₹{unconfirmedOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Pending conversion to dispatch status</p>
          </div>
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Navigation Bar */}
      <div className={`p-2 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-1 w-full md:w-auto">
          <button
            onClick={() => setQueueTab('unconfirmed')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              queueTab === 'unconfirmed'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Unconfirmed Queue ({unconfirmedOrders.length})</span>
          </button>

          <button
            onClick={() => setQueueTab('confirmed')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              queueTab === 'confirmed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed Archive ({confirmedOrders.length})</span>
          </button>

          <button
            onClick={() => setQueueTab('integration_guide')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              queueTab === 'integration_guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase + WhatsApp Setup Guide</span>
          </button>
        </div>

        {queueTab !== 'integration_guide' && (
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search phone, name, raw message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        )}
      </div>

      {/* Main Tab Content Display */}
      {queueTab === 'integration_guide' ? (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-indigo-500 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5" />
              <span>How to Connect Live Supabase Database & WhatsApp Cloud API</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Follow this step-by-step setup to automatically stream incoming customer WhatsApp messages into your Supabase database and trigger automated dispatch confirmations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Supabase Table Creation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Create Supabase SQL Table</span>
                </span>
                <button
                  onClick={() => handleCopyCode(supabaseTableSql, 'sql_table')}
                  className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded text-[10px] font-mono flex items-center space-x-1"
                >
                  {copiedCode === 'sql_table' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'sql_table' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[10px] overflow-x-auto border border-slate-800 max-h-56">
                {supabaseTableSql}
              </pre>
            </div>

            {/* Step 2: Supabase Edge Function / Webhook */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Supabase Edge Function Webhook</span>
                </span>
                <button
                  onClick={() => handleCopyCode(edgeFunctionCode, 'edge_fn')}
                  className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded text-[10px] font-mono flex items-center space-x-1"
                >
                  {copiedCode === 'edge_fn' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'edge_fn' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-sky-300 font-mono text-[10px] overflow-x-auto border border-slate-800 max-h-56">
                {edgeFunctionCode}
              </pre>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1 text-indigo-700 dark:text-indigo-300">
            <p className="font-bold">Step 3: Register Webhook URL in Meta WhatsApp Business Console</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              In Meta Developer Portal &rarr; WhatsApp &rarr; Configuration: Set Webhook URL to <code className="font-mono bg-indigo-500/20 px-1 rounded">https://&lt;your-supabase-project&gt;.supabase.co/functions/v1/whatsapp-webhook</code> and verify token to <code className="font-mono bg-indigo-500/20 px-1 rounded">RUTUJA_ART_VERIFY_TOKEN</code>.
            </p>
          </div>
        </div>
      ) : displayedList.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <MessageSquare className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            No {queueTab === 'unconfirmed' ? 'Unconfirmed WhatsApp Orders' : 'Confirmed WhatsApp Orders'} Found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {queueTab === 'unconfirmed'
              ? 'All incoming WhatsApp artwork orders have been confirmed! Click "Simulate Incoming WhatsApp Message" to test.'
              : 'Confirmed orders will appear here once you approve them from the unconfirmed queue.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedList.map((order) => {
            const isUnconfirmed = order.orderConfirmationStatus === 'Unconfirmed' || !order.whatsappDetails?.sentConfirmationAt;

            return (
              <div
                key={order.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                  isDarkMode
                    ? isUnconfirmed
                      ? 'bg-slate-900/90 border-amber-500/30'
                      : 'bg-slate-900/90 border-slate-800'
                    : isUnconfirmed
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {order.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
                        isUnconfirmed
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isUnconfirmed ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{isUnconfirmed ? '🟡 Unconfirmed (Pending Review)' : '🟢 Confirmed & WhatsApp Sent'}</span>
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {order.whatsappDetails?.receivedAt || order.orderDate}
                    </span>
                  </div>

                  {/* Customer Contact */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{order.customer.name}</p>
                      <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        <span>{order.customer.phone}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {/* Artwork Item snippet */}
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 flex items-center space-x-3">
                    <img
                      src={order.items[0]?.image}
                      alt={order.items[0]?.title}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-300 dark:border-slate-700"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                        {order.items[0]?.title}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {order.items[0]?.category} • {order.items[0]?.dimensions}
                      </p>
                    </div>
                  </div>

                  {/* Incoming WhatsApp raw message payload box */}
                  <div className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[10px] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                      <span>WhatsApp Payload Snippet:</span>
                      <span className="text-emerald-400 font-bold">{order.whatsappDetails?.whatsappMsgId || 'WAMID.889102'}</span>
                    </div>
                    <p className="text-slate-300 line-clamp-2 italic">
                      "{order.whatsappDetails?.rawMessage || `Ordering ${order.items[0]?.title}`}"
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isUnconfirmed ? 'Action Needed: Verify Payment & Confirm' : `Waybill: ${order.trackingNumber || 'BD-120938'}`}
                  </div>

                  {isUnconfirmed ? (
                    <button
                      onClick={() => onConfirmWhatsAppOrder(order)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Send WhatsApp Alert</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 text-emerald-500 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmed on {order.whatsappDetails?.sentConfirmationAt || order.orderDate}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simulate Incoming Order Modal Overlay */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-4 border-b flex items-center justify-between bg-emerald-600 text-white">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold text-xs">Simulate Incoming WhatsApp Customer Order</h3>
              </div>
              <button onClick={() => setIsSimulateModalOpen(false)} className="text-white hover:opacity-80">
                ✕
              </button>
            </div>

            <form onSubmit={handleRunSimulation} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    required
                    className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    required
                    className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Artwork Item Purchased</label>
                <input
                  type="text"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  required
                  className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    required
                    className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Delivery City</label>
                  <input
                    type="text"
                    value={simCity}
                    onChange={(e) => setSimCity(e.target.value)}
                    required
                    className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Full Shipping Address</label>
                <input
                  type="text"
                  value={simAddress}
                  onChange={(e) => setSimAddress(e.target.value)}
                  required
                  className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Raw WhatsApp Message Text</label>
                <textarea
                  rows={3}
                  value={simText}
                  onChange={(e) => setSimText(e.target.value)}
                  required
                  className={`w-full p-2 rounded border font-mono text-[11px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Receive Order in Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
