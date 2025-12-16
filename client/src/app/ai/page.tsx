"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Greetings. I am the Consigliere. How can I assist you with your code today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input } as Message];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // Convert history to Gemini format if needed, or just send last message
            // For simplicity, we send just the message for now, or implement history in backend
            const res = await api.post('/ai/chat', { message: input });
            setMessages([...newMessages, { role: 'model', text: res.data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages([...newMessages, { role: 'model', text: 'My connection is compromised. Try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 h-[calc(100vh-100px)] flex flex-col">
            <Card className="flex-1 flex flex-col border-border bg-card">
                <CardHeader className="border-b border-border">
                    <CardTitle className="text-2xl font-bold text-primary">Mafia Consigliere (AI)</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && <div className="text-muted-foreground text-sm animate-pulse">Consigliere is thinking...</div>}
                </CardContent>
                <div className="p-4 border-t border-border flex gap-2">
                    <Input
                        placeholder="Ask for advice..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={loading}>Send</Button>
                </div>
            </Card>
        </div>
    );
}
