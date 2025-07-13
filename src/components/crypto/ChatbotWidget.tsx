import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { chatbotService, ChatResponse } from '@/utils/chatbotService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'alert' | 'info';
}

interface ChatbotWidgetProps {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

const ChatbotWidget = ({ isOpen = false, onToggle, className = '' }: ChatbotWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! I\'m here to help with your crypto trading. What can I assist you with today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { text: 'Portfolio Status', icon: '📊' },
    { text: 'Market Trends', icon: '📈' },
    { text: 'Set Alert', icon: '🔔' },
    { text: 'Trading Tips', icon: '💡' }
  ];



  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Get bot response from service
    setTimeout(async () => {
      try {
        const response: ChatResponse = await chatbotService.processMessage(inputValue);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          sender: 'bot',
          timestamp: new Date(),
          type: response.type,
          data: response.data
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      setIsLoading(false);
    }, 600);
  };



  const handleQuickAction = (action: string) => {
    setInputValue(action);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onToggle?.(true)}
                className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/30 shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat with AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="w-80 h-96 bg-slate-800/90 backdrop-blur-sm border-purple-500/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-purple-500/20 rounded">
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-200">Trading Assistant</h3>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                Online
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggle?.(false)}
                    className="h-6 w-6 p-0 text-purple-300 hover:text-purple-200"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Minimize</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="h-64 p-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className={message.sender === 'bot' ? 'bg-purple-500/20 text-purple-400 text-xs' : 'bg-blue-500/20 text-blue-400 text-xs'}>
                      {message.sender === 'bot' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-2 text-xs ${
                    message.sender === 'user' 
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' 
                      : 'bg-slate-700/50 text-slate-200 border border-slate-600/30'
                  }`}>
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                      <Bot className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/30">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-3 border-t border-purple-500/20">
          <div className="flex flex-wrap gap-1 mb-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.text)}
                className="text-xs h-6 px-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              >
                <span className="mr-1">{action.icon}</span>
                {action.text}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 h-8 text-xs bg-slate-700/50 border-slate-600/30 text-purple-200 placeholder:text-purple-400 focus:border-purple-500/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="h-8 w-8 p-0 bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/30"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotWidget; 