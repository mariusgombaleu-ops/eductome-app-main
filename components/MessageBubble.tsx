import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-royal-600' : 'bg-emerald-600'
        }`}>
            {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col gap-2 min-w-0`}>
             <div className={`p-5 rounded-2xl shadow-sm border overflow-x-auto ${
                isUser 
                ? 'bg-royal-900/40 border-royal-700/50 text-slate-100 rounded-tr-none' 
                : 'bg-slate-800/80 border-slate-700 text-slate-200 rounded-tl-none'
             }`}>
                {message.image && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-700/50">
                        <img src={message.image} alt="Upload" className="max-w-full h-auto max-h-64 object-contain" />
                    </div>
                )}
                
                {message.isThinking ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Le mentor réfléchit...
                    </div>
                ) : (
                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 max-w-none text-sm md:text-base overflow-hidden">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-emerald-400 font-semibold" {...props} />,
                                code: ({node, inline, className, children, ...props}: any) => {
                                  return inline ? (
                                    <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300" {...props}>{children}</code>
                                  ) : (
                                    <code className="block bg-slate-900 p-2 rounded text-emerald-300 my-2 whitespace-pre-wrap overflow-x-auto" {...props}>{children}</code>
                                  );
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
             </div>
             <span className={`text-[10px] text-slate-500 ${isUser ? 'text-right' : 'text-left'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;