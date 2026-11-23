import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  EnvelopeSimple, 
  PaperPlaneRight, 
  Paperclip, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  CheckCircle, 
  X, 
  FileText, 
  Buildings,
  Flag,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { useToast } from '../../context/ToastContext';
import ReportListingModal from '../../components/dashboard/ReportListingModal';

export default function Messages() {
  const { conversationId } = useParams();
  const { conversations, sendMessage, profile } = useCustomerDashboard();
  const { toastSuccess, toastInfo } = useToast();

  const [activeConvId, setActiveConvId] = useState(() => {
    return conversationId || (conversations.length > 0 ? conversations[0].id : null);
  });

  const [inputText, setInputText] = useState('');
  const [mockAttachment, setMockAttachment] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      setActiveConvId(conversationId);
    }
  }, [conversationId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !mockAttachment) return;

    const attachments = mockAttachment ? [mockAttachment] : [];
    sendMessage(activeConversation.id, inputText.trim(), attachments);
    setInputText('');
    setMockAttachment(null);
  };

  const handleAttachMock = () => {
    setMockAttachment({
      name: 'Client_Requirements_Note.pdf',
      size: '1.2 MB'
    });
    toastInfo('Document attached', 'Client Requirements Note attached to message.');
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 14.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Messages and advisor conversations"
        description="Direct authenticated communication channels with certified property advisors and concierge desks."
      />

      {/* =========================================================================
          2. MASTER-DETAIL INTERFACE (PRD Section 14.2 & 14.3)
         ========================================================================= */}
      {conversations.length > 0 ? (
        <Card className="rounded-3xl bg-white border border-slate-100 shadow-xs overflow-hidden flex flex-col md:flex-row h-[680px]">
          
          {/* Left: Conversation List (w-80 or full on mobile) */}
          <div className={`md:w-80 border-r border-slate-200/80 flex flex-col shrink-0 ${
            activeConvId && 'hidden md:flex'
          }`}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="caption-2 font-bold text-slate-400 uppercase tracking-wider">All conversations</span>
              <span className="text-small font-bold text-brand-navy bg-slate-100 px-2 py-0.5 rounded-full">
                {conversations.length}
              </span>
            </div>

            <ScrollArea className="flex-1 p-2 space-y-1">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                      isActive 
                        ? 'bg-blue-50/70 border border-blue-100' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={conv.agentAvatar}
                      alt={conv.agentName}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-small font-bold text-brand-navy truncate">{conv.agentName}</p>
                        <span className="text-caption text-slate-400 shrink-0">{conv.lastUpdated.split(',')[0]}</span>
                      </div>
                      <p className="text-small font-semibold text-brand-blue truncate mt-0.5">
                        {conv.propertyTitle}
                      </p>
                      <p className="caption-2 text-slate-500 truncate mt-1">
                        {lastMsg?.text || 'No messages'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-brand-blue text-white text-caption font-bold flex items-center justify-center shrink-0 mt-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </ScrollArea>
          </div>

          {/* Right: Active Conversation Thread */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
              
              {/* Thread Header */}
              <div className="p-4 px-6 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden text-xs text-brand-blue font-semibold"
                  >
                    ← Back
                  </button>
                  <img
                    src={activeConversation.agentAvatar}
                    alt={activeConversation.agentName}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-small font-bold text-brand-navy truncate">{activeConversation.agentName}</h3>
                      <span className="inline-flex items-center gap-0.5 text-caption text-emerald-600 font-semibold">
                        <ShieldCheck size={12} weight="fill" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <p className="caption-2 text-slate-500 truncate">{activeConversation.agency}</p>
                  </div>
                </div>

                {/* Property pill & report trigger */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/property/${activeConversation.propertyId}`}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-brand-navy hover:text-brand-blue transition-colors max-w-xs truncate"
                  >
                    <span className="truncate">{activeConversation.propertyTitle}</span>
                    <ArrowSquareOut size={14} className="shrink-0 text-slate-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    title="Report conversation"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Flag size={16} />
                  </button>
                </div>
              </div>

              {/* Thread Messages Stream */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                {/* Related Property Banner Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 max-w-lg mx-auto mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activeConversation.propertyImage}
                      alt={activeConversation.propertyTitle}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-small font-bold text-brand-navy truncate">{activeConversation.propertyTitle}</p>
                      <p className="caption-2 text-slate-500 truncate">{activeConversation.propertyLocation} • {activeConversation.propertyPrice}</p>
                    </div>
                  </div>
                  <Link to={`/dashboard/site-visits`}>
                    <Button size="sm" variant="outline" className="rounded-xl text-small h-7 border-slate-200 shrink-0">
                      Book visit
                    </Button>
                  </Link>
                </div>

                {/* Messages Bubbles */}
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.sender === 'customer';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-2 px-1">
                        <span className="caption-2 text-slate-400 font-medium">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <span className="text-caption text-slate-400">{msg.time}</span>
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-brand-navy text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Attachments preview */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/20 space-y-1.5">
                            {msg.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 p-2 rounded-xl text-small ${
                                  isMe ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-700'
                                }`}
                              >
                                <FileText size={16} />
                                <span className="font-semibold truncate">{att.name}</span>
                                <span className="opacity-70 ml-auto">{att.size}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* Message Composer (PRD Section 14.3 & 14.4) */}
              <div className="p-4 bg-white border-t border-slate-200/80 space-y-2">
                
                {/* Pending attachment preview */}
                {mockAttachment && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 border border-blue-100 text-xs text-brand-blue max-w-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} />
                      <span className="font-semibold truncate">{mockAttachment.name}</span>
                      <span className="caption-2 text-slate-500">({mockAttachment.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMockAttachment(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAttachMock}
                    title="Attach document (PDF/JPG)"
                    className="p-2.5 rounded-2xl text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Paperclip size={20} />
                  </button>

                  <input
                    type="text"
                    placeholder="Type your message to the verified advisor..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 py-2.5 px-4 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />

                  <Button size="sm"
                    type="submit"
                    className="rounded-2xl text-xs h-10 px-4 bg-brand-navy hover:bg-slate-900 text-white cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send</span>
                    <PaperPlaneRight size={14} weight="bold" />
                  </Button>
                </form>

                <p className="text-caption text-slate-400 px-2 text-center sm:text-left">
                  Advisor replies are notified via email and portal notifications within business hours.
                </p>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
              Select a conversation from the left to start messaging.
            </div>
          )}

        </Card>
      ) : (
        <Card className="p-12 rounded-3xl bg-white border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <EnvelopeSimple size={32} />
          </div>
          <div>
            <h3 className="text-h4 font-bold text-brand-navy">No messages in inbox</h3>
            <p className="caption-2 text-slate-500 max-w-sm mx-auto mt-1">
              When you enquire about a verified residence or request a site visit, your advisor conversations will appear here.
            </p>
          </div>
        </Card>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportListingModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          property={{
            title: activeConversation?.propertyTitle,
            location: activeConversation?.propertyLocation,
            images: [activeConversation?.propertyImage]
          }}
        />
      )}

    </div>
  );
}
