"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Brain, Send, Loader2, User, Mic, FileCode, Bug, Lightbulb, Sparkles } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';

interface Message {
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export default function ConsiglierePage() {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: "I am The Consigliere. I serve the family with wisdom and code. What business do we have today?",
            timestamp: new Date()
        }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: new Date() }]);
        setIsLoading(true);

        try {
            const history = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            const reply = await aiService.chat(userMessage, history);
            setMessages(prev => [...prev, { role: 'model', text: reply, timestamp: new Date() }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Forgive me. The connection is compromised. I cannot speak now.", timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestion = (text: string) => {
        setInput(text);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0a0a0a] text-foreground flex flex-col relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-background to-background pointer-events-none" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

            {/* Header */}
            <header className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm z-10 flex justify-between items-center sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center ring-2 ring-purple-500/20 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide text-white">The Consigliere</h1>
                        <p className="text-xs text-purple-400 font-medium tracking-widest uppercase">Private Channel • Encrypted</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-2">
                    <SuggestionPill icon={Bug} text="Debug this code" onClick={() => handleSuggestion("I found a bug in my code. Can you help me fix it?")} />
                    <SuggestionPill icon={FileCode} text="Optimize solution" onClick={() => handleSuggestion("How can I optimize the time complexity of this algorithm?")} />
                    <SuggestionPill icon={Lightbulb} text="Explain concept" onClick={() => handleSuggestion("Explain dynamic programming like I'm a 5 year old.")} />
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar relative z-10" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`group flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-orange-600'
                            : 'bg-gradient-to-br from-purple-600 to-indigo-900'
                            }`}>
                            {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Brain className="h-4 w-4 text-white" />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[80%] md:max-w-[60%] space-y-1`}>
                            <div className={`flex items-center gap-2 text-xs text-muted-foreground mb-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                <span>{msg.role === 'user' ? user?.username || 'You' : 'Consigliere'}</span>
                                <span>•</span>
                                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={`p-4 rounded-2xl leading-relaxed shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                ? 'bg-primary/90 text-primary-foreground rounded-br-none'
                                : 'bg-white/5 border border-white/10 text-gray-100 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center shrink-0">
                            <Brain className="h-4 w-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-black/40 backdrop-blur-md border-t border-white/5 relative z-20">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message to the Consigliere..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-14 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-inner"
                        disabled={isLoading}
                        autoFocus
                    />
                    <div className="absolute right-2 top-2 bottom-2">
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="h-full aspect-square rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">
                    <Sparkles className="inline h-3 w-3 mr-1 text-purple-500" />
                    AI-powered advice. Always verify with the Dons before executing in production.
                </p>
            </div>
        </div>
    );
}

function SuggestionPill({ icon: Icon, text, onClick }: { icon: any, text: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all text-xs font-medium text-gray-300 hover:text-white group"
        >
            <Icon className="h-3 w-3 text-purple-500 group-hover:text-purple-400" />
            {text}
        </button>
    );
}
