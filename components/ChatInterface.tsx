import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message, Subject, ChatSession } from '../types';
import { generateMentorResponse } from '../services/geminiService';
import { storageService } from '../services/storageService';
import MessageBubble from './MessageBubble';
import { Send, Paperclip, X } from 'lucide-react';

interface ChatInterfaceProps {
  user: UserProfile;
  currentSubject: Subject;
  session: ChatSession;
  onSessionUpdate: (session: ChatSession) => void;
  onPointsUpdate: (pts: number) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  user, 
  currentSubject, 
  session, 
  onSessionUpdate,
  onPointsUpdate
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isProcessing) return;

    const userMsgContent = inputText;
    const userImage = selectedImage;

    // 1. Create User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsgContent,
      image: userImage || undefined,
      timestamp: Date.now()
    };

    const updatedMessages = [...session.messages, newUserMsg];
    const updatedSession = { 
        ...session, 
        messages: updatedMessages,
        lastUpdated: Date.now()
    };
    
    // Update local state and parent immediately for UI response
    onSessionUpdate(updatedSession);
    setInputText('');
    setSelectedImage(null);
    setIsProcessing(true);

    // Calculate Discipline Points (Gamification)
    // +10 for message length > 20 chars, +20 for image upload
    let pointsEarned = 2; // Base engagement
    if (userMsgContent.length > 20) pointsEarned += 8;
    if (userImage) pointsEarned += 20;
    onPointsUpdate(pointsEarned);

    // 2. Add temporary "Thinking" message
    const thinkingMsgId = (Date.now() + 1).toString();
    const thinkingMsg: Message = {
        id: thinkingMsgId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isThinking: true
    };
    onSessionUpdate({
        ...updatedSession,
        messages: [...updatedMessages, thinkingMsg]
    });

    // 3. Call Gemini API
    const responseText = await generateMentorResponse(
        user,
        updatedMessages, // History includes new user msg
        userMsgContent,
        userImage || undefined,
        currentSubject
    );

    // 4. Replace Thinking with Real Response
    const newAiMsg: Message = {
        id: thinkingMsgId,
        role: 'model',
        content: responseText,
        timestamp: Date.now()
    };

    const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, newAiMsg],
        lastUpdated: Date.now()
    };
    
    onSessionUpdate(finalSession);
    storageService.saveSession(finalSession);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full relative w-full">
      {/* Chat Area - min-h-0 is crucial for nested flex scrolling */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 scroll-smooth min-h-0 w-full">
        {session.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
            <p>Commencez la discussion sur : {currentSubject}</p>
          </div>
        )}
        {session.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 absolute bottom-0 left-0 w-full bg-dark-900 border-t border-slate-800 p-4 z-10">
        {selectedImage && (
            <div className="absolute bottom-full left-4 mb-2 bg-slate-800 p-2 rounded-lg border border-slate-700 shadow-lg flex items-start gap-2">
                <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded" />
                <button onClick={clearImage} className="text-slate-400 hover:text-red-400">
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}
        
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-2">
           <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
           />
           <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-full transition-colors"
              title="Ajouter une image (brouillon, exercice)"
           >
              <Paperclip className="w-5 h-5" />
           </button>

           <div className="flex-1 relative">
             <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={selectedImage ? "Ajoutez un commentaire..." : "Pose ta question ou décris ton blocage..."}
                className="w-full bg-slate-800 text-slate-100 rounded-xl pl-4 pr-12 py-3 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-500"
                disabled={isProcessing}
             />
             <button 
                type="submit" 
                disabled={(!inputText && !selectedImage) || isProcessing}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                    (!inputText && !selectedImage) || isProcessing
                    ? 'text-slate-600 bg-transparent'
                    : 'bg-emerald-500 text-white shadow-lg hover:bg-emerald-400'
                }`}
             >
                <Send className="w-4 h-4" />
             </button>
           </div>
        </form>
        <div className="max-w-4xl mx-auto text-center mt-2">
             <p className="text-[10px] text-slate-600">L'IA peut faire des erreurs. Vérifiez toujours vos formules.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;