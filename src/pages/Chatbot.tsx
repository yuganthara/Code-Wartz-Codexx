import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Sparkles, TrendingUp, AlertTriangle, Info, MessageCircle, Settings, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatbotWidget from '@/components/crypto/ChatbotWidget';
import { chatbotService, ChatResponse } from '@/utils/chatbotService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'alert' | 'info';
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your crypto trading assistant. I can help you with market analysis, portfolio insights, trading strategies, and more. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    'Show my portfolio performance',
    'What\'s the current market trend?',
    'Set up a price alert',
    'Explain trading strategies',
    'Market news today'
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
        
        // Add suggestions if available
        if (response.suggestions && response.suggestions.length > 0) {
          const suggestionsMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: `💡 Quick actions: ${response.suggestions.join(', ')}`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'suggestion'
          };
          setMessages(prev => [...prev, suggestionsMessage]);
        }
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
    }, 800);
  };



  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg mb-2">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-purple-200">Crypto Trading Assistant</h1>
            <p className="text-purple-300 text-sm mb-2">Your AI-powered trading companion</p>
            <div className="flex items-center space-x-2 justify-center">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Online
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWidgetOpen(!isWidgetOpen)}
                className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Widget Mode
              </Button>
            </div>
          </div>


          {/* Chat Messages */}
          <ScrollArea ref={scrollAreaRef} className="h-96 mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.sender === 'bot' ? '/bot-avatar.png' : '/user-avatar.png'} />
                      <AvatarFallback className={message.sender === 'bot' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}>
                        {message.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' 
                        : 'bg-slate-700/50 text-slate-200 border border-slate-600/30'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-500/20 text-purple-400">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          <div className="mb-4">
            <p className="text-sm text-purple-300 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about crypto trading, portfolio analysis, market trends..."
              className="flex-1 bg-slate-700/50 border-slate-600/30 text-purple-200 placeholder:text-purple-400 focus:border-purple-500/50"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/30"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-700/30 border-purple-500/20 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-medium text-purple-200">Market Analysis</h3>
              </div>
              <p className="text-xs text-purple-300">Real-time market insights and trend analysis</p>
            </Card>
            <Card className="bg-slate-700/30 border-purple-500/20 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-medium text-purple-200">Price Alerts</h3>
              </div>
              <p className="text-xs text-purple-300">Set up custom price notifications</p>
            </Card>
            <Card className="bg-slate-700/30 border-purple-500/20 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-medium text-purple-200">AI Insights</h3>
              </div>
              <p className="text-xs text-purple-300">Advanced AI-powered trading recommendations</p>
            </Card>
          </div>
        </Card>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget 
        isOpen={isWidgetOpen} 
        onToggle={setIsWidgetOpen}
      />
    </div>
  );
};

export default Chatbot; 