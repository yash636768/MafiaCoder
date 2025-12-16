"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProblemDetail {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    examples: { input: string; output: string; explanation: string }[];
}

export default function ProblemPage() {
    const { slug } = useParams();
    const [problem, setProblem] = useState<ProblemDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Editor State
    const [code, setCode] = useState(`// Welcome to the Mafia Coder interface\n// Choose your weapon (language) and start coding\n\nprint("Hello World")`);
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'output' | 'input'>('output');
    const [customInput, setCustomInput] = useState('');

    // New Test Case State
    const [showAddTestCase, setShowAddTestCase] = useState(false);
    const [newTestCase, setNewTestCase] = useState({ input: '', output: '', explanation: '' });
    const [submittingTestCase, setSubmittingTestCase] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await api.get(`/problems/${slug}`);
                setProblem(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProblem();
    }, [slug]);

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('Executing code...');
        try {
            const res = await api.post('/compiler/execute', {
                language,
                code,
                stdin: customInput
            });

            if (res.data.run) {
                setOutput(res.data.run.output || 'No output');
            } else {
                setOutput(JSON.stringify(res.data, null, 2));
            }
            setActiveTab('output');
        } catch (err: any) {
            setOutput('Execution failed: ' + (err.response?.data?.error || err.message));
            setActiveTab('output');
        } finally {
            setIsRunning(false);
        }
    };

    const handleAddTestCase = async () => {
        if (!newTestCase.input || !newTestCase.output) return;
        setSubmittingTestCase(true);
        try {
            await api.post(`/problems/${slug}/testcase`, { ...newTestCase, isHidden: false });
            // Refresh problem to show new example
            const res = await api.get(`/problems/${slug}`);
            setProblem(res.data);
            setNewTestCase({ input: '', output: '', explanation: '' });
            setShowAddTestCase(false);
        } catch (err) {
            console.error('Failed to add test case', err);
        } finally {
            setSubmittingTestCase(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading mission details...</div>;
    if (!problem) return <div className="p-8 text-center">Mission not found.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-80px)] p-4 max-w-[1800px] mx-auto">
            {/* Left Panel: Problem Description */}
            <div className="space-y-4 overflow-y-auto pr-2 h-full custom-scrollbar">
                <Card className="h-full border-border bg-card/50 backdrop-blur flex flex-col">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <div className="flex justify-between items-start gap-4">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
                                {problem.title}
                            </CardTitle>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${problem.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                    'bg-green-500/10 text-green-500 border-green-500/20'
                                }`}>
                                {problem.difficulty}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 flex-1 overflow-y-auto">
                        <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
                            <p className="whitespace-pre-line">{problem.description}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary rounded-full" /> Input Format
                                </h3>
                                <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/50">
                                    {problem.inputFormat}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary rounded-full" /> Output Format
                                </h3>
                                <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/50">
                                    {problem.outputFormat}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary rounded-full" /> Constraints
                                </h3>
                                <pre className="text-xs bg-secondary/50 p-3 rounded-lg border border-border/50 font-mono text-muted-foreground whitespace-pre-wrap">
                                    {problem.constraints}
                                </pre>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">Examples</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddTestCase(!showAddTestCase)}
                                    className="text-xs h-7"
                                >
                                    {showAddTestCase ? 'Cancel' : '+ Add Test Case'}
                                </Button>
                            </div>

                            {showAddTestCase && (
                                <div className="bg-secondary/20 border border-border p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="text-sm font-semibold">New Test Case</h4>
                                    <input
                                        className="w-full bg-black/30 border border-border/50 rounded p-2 text-sm text-foreground"
                                        placeholder="Input"
                                        value={newTestCase.input}
                                        onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                                    />
                                    <input
                                        className="w-full bg-black/30 border border-border/50 rounded p-2 text-sm text-foreground"
                                        placeholder="Expected Output"
                                        value={newTestCase.output}
                                        onChange={(e) => setNewTestCase({ ...newTestCase, output: e.target.value })}
                                    />
                                    <input
                                        className="w-full bg-black/30 border border-border/50 rounded p-2 text-sm text-foreground"
                                        placeholder="Explanation (Optional)"
                                        value={newTestCase.explanation}
                                        onChange={(e) => setNewTestCase({ ...newTestCase, explanation: e.target.value })}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleAddTestCase}
                                        disabled={submittingTestCase}
                                        className="w-full"
                                    >
                                        {submittingTestCase ? 'Adding...' : 'Save Test Case'}
                                    </Button>
                                </div>
                            )}

                            {problem.examples.map((ex, i) => (
                                <div key={i} className="bg-secondary/20 border border-border/50 p-4 rounded-xl space-y-3">
                                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                                        <span className="font-semibold text-muted-foreground">Input:</span>
                                        <code className="bg-black/30 px-2 py-0.5 rounded font-mono text-foreground break-all">{ex.input}</code>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                                        <span className="font-semibold text-muted-foreground">Output:</span>
                                        <code className="bg-black/30 px-2 py-0.5 rounded font-mono text-green-400 break-all">{ex.output}</code>
                                    </div>
                                    {ex.explanation && (
                                        <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                                            <span className="font-semibold text-muted-foreground">Note:</span>
                                            <span className="text-muted-foreground italic">{ex.explanation}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: Code Editor */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex-1 border-border bg-[#1e1e1e] flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-2 bg-[#252526] border-b border-[#333]">
                        <div className="flex items-center gap-2">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-[#3c3c3c] text-white text-xs px-3 py-1.5 rounded border border-[#444] outline-none focus:border-primary"
                            >
                                <option value="python">Python (3.10)</option>
                                <option value="javascript">JavaScript (Node 18)</option>
                                <option value="typescript">TypeScript (5.0)</option>
                                <option value="c">C (GCC 10.2)</option>
                                <option value="cpp">C++ (GCC 10.2)</option>
                                <option value="java">Java (OpenJDK 15)</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="h-7 text-xs bg-green-700 hover:bg-green-600 text-white border-0"
                            >
                                {isRunning ? 'Running...' : 'Run Code ▶'}
                            </Button>
                            <Button size="sm" className="h-7 text-xs bg-primary hover:bg-red-700">
                                Submit
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        {/* Editor Component would be here, usually imported differently to avoid SSR issues in Next.js */}
                        {/* Since we can't easily dynamic import inside this replacement, I'll use a dynamic import approach at the top or a component wrapper */}
                        <EditorWrapper
                            language={language}
                            code={code}
                            onChange={setCode}
                        />
                    </div>
                </Card>

                {/* Console / Output Panel */}
                <Card className="h-1/3 border-border bg-[#1e1e1e] flex flex-col overflow-hidden text-sm">
                    <div className="flex items-center gap-4 px-4 py-2 bg-[#252526] border-b border-[#333]">
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`pb-1 text-xs font-medium transition-colors border-b-2 ${activeTab === 'output' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
                        >
                            Output
                        </button>
                        <button
                            onClick={() => setActiveTab('input')}
                            className={`pb-1 text-xs font-medium transition-colors border-b-2 ${activeTab === 'input' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
                        >
                            Custom Input
                        </button>
                    </div>
                    <div className="flex-1 p-0 overflow-hidden relative flex flex-col">
                        {activeTab === 'output' ? (
                            <pre className="p-4 font-mono text-xs text-white/90 h-full overflow-auto whitespace-pre-wrap">
                                {output || 'Run code to see output...'}
                            </pre>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="p-2 border-b border-[#333] bg-[#252526] flex gap-2 overflow-x-auto">
                                    <span className="text-xs text-muted-foreground self-center">Load Example:</span>
                                    {problem.examples.map((ex, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCustomInput(ex.input)}
                                            className="px-2 py-1 bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white text-[10px] rounded border border-[#444] whitespace-nowrap"
                                        >
                                            Ex {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    className="flex-1 w-full bg-transparent p-4 font-mono text-xs text-white/90 focus:outline-none resize-none"
                                    placeholder="Enter custom input here..."
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Simple wrapper to handle Monaco Editor import
import Editor from '@monaco-editor/react';

function EditorWrapper({ language, code, onChange }: { language: string, code: string, onChange: (val: string) => void }) {
    return (
        <Editor
            height="100%"
            language={language === 'c' || language === 'cpp' ? 'cpp' : language}
            value={code}
            theme="vs-dark"
            onChange={(value) => onChange(value || '')}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    );
}
