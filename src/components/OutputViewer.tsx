import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneratedFile {
    path: string;
    content: string;
}

interface GenerationResult {
    projectName: string;
    provider: string;
    model: string;
    files: GeneratedFile[];
    notes?: string[];
}

export function OutputViewer({
    result,
    onClose,
}: {
    result: GenerationResult | null;
    onClose: () => void;
}) {
    const [activeFile, setActiveFile] = useState(0);

    if (!result) return null;

    const file = result.files[activeFile];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="material-overlay fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    className="glass-card rounded-xl p-5 max-w-4xl w-full max-h-[85vh] flex flex-col border border-neon/30"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-neon font-bold tracking-wider text-sm">
                                AI OUTPUT — {result.projectName}
                            </h3>
                            <p className="text-neon/40 text-[10px] mt-1">
                                Provider: {result.provider.toUpperCase()} ({result.model}) • {result.files.length} files generated
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="ui-button text-red/70 hover:text-red text-xs border border-red/30 px-3 py-1 rounded-lg cursor-pointer hover:bg-red/10"
                        >
                            CLOSE
                        </button>
                    </div>

                    {/* File Tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-2 mb-3 scrollbar-thin">
                        {result.files.map((f, i) => (
                            <button
                                key={f.path}
                                type="button"
                                onClick={() => setActiveFile(i)}
                                className={`ui-button shrink-0 text-[11px] px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${i === activeFile
                                        ? 'border-neon/60 bg-neon/10 text-neon font-bold'
                                        : 'border-neon/15 text-neon/40 hover:text-neon/70 hover:border-neon/30'
                                    }`}
                            >
                                {f.path.split('/').pop()}
                            </button>
                        ))}
                    </div>

                    {/* File Path */}
                    <div className="text-[10px] text-cyan/50 mb-2 font-mono">
                        📄 {file?.path}
                    </div>

                    {/* Code Content */}
                    <div className="material-surface-strong rounded-lg p-4 overflow-auto flex-1 min-h-0">
                        <pre className="text-xs font-mono text-neon/80 leading-relaxed whitespace-pre-wrap break-words">
                            {file?.content ?? 'No content'}
                        </pre>
                    </div>

                    {/* Notes */}
                    {result.notes && result.notes.length > 0 && (
                        <div className="mt-3 text-[10px] text-neon/30 space-y-0.5">
                            {result.notes.map((note, i) => (
                                <p key={i}>💡 {note}</p>
                            ))}
                        </div>
                    )}

                    {/* Copy button */}
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(file?.content ?? '');
                                alert('Code copied to clipboard!');
                            }}
                            className="ui-button text-[11px] px-4 py-2 rounded-lg border border-cyan/30 text-cyan hover:bg-cyan/10 cursor-pointer"
                        >
                            📋 COPY CODE
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const allCode = result.files.map(f => `// === ${f.path} ===\n${f.content}`).join('\n\n');
                                navigator.clipboard.writeText(allCode);
                                alert('All files copied to clipboard!');
                            }}
                            className="ui-button text-[11px] px-4 py-2 rounded-lg border border-neon/30 text-neon hover:bg-neon/10 cursor-pointer"
                        >
                            📦 COPY ALL FILES
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
