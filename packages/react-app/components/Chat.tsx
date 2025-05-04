"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isSystem?: boolean;
  isMinPay?: boolean;
  minPayAction?: 'initiate' | 'confirm' | 'complete';
}

interface ChatProps {
  tradeId: string;
  counterparty: string;
  paymentMethod?: string;
}

export default function Chat({ tradeId, counterparty, paymentMethod }: ChatProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minPayStatus, setMinPayStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  // Mock messages for MinPay demo
  useEffect(() => {
    if (paymentMethod === 'MiniPay') {
      setMessages([
        {
          id: '1',
          sender: counterparty,
          content: 'Hi, I want to buy USDT using MinPay',
          timestamp: Date.now() - 300000
        },
        {
          id: '2',
          sender: address || '',
          content: 'Sure, I can sell you USDT. Please initiate MinPay transfer',
          timestamp: Date.now() - 240000
        },
        {
          id: '3',
          sender: 'system',
          content: 'MinPay transaction initiated. ID: MP-TX-123456',
          timestamp: Date.now() - 180000,
          isSystem: true,
          isMinPay: true,
          minPayAction: 'initiate'
        },
        {
          id: '4',
          sender: 'system',
          content: 'Waiting for MinPay confirmation...',
          timestamp: Date.now() - 120000,
          isSystem: true,
          isMinPay: true
        }
      ]);
    }
  }, [address, counterparty, paymentMethod]);

  const handleMinPayAction = async (action: 'confirm' | 'cancel' | 'complete') => {
    setIsLoading(true);
    try {
      // Simulate MinPay action
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (action) {
        case 'confirm':
          setMinPayStatus('processing');
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'system',
            content: 'MinPay payment confirmed. Processing transaction...',
            timestamp: Date.now(),
            isSystem: true,
            isMinPay: true,
            minPayAction: 'confirm'
          }]);
          break;
        case 'complete':
          setMinPayStatus('completed');
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'system',
            content: 'MinPay transaction completed successfully!',
            timestamp: Date.now(),
            isSystem: true,
            isMinPay: true,
            minPayAction: 'complete'
          }]);
          break;
        case 'cancel':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'system',
            content: 'MinPay transaction cancelled.',
            timestamp: Date.now(),
            isSystem: true,
            isMinPay: true
          }]);
          break;
      }
    } catch (error) {
      console.error('Error processing MinPay action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      // Add new message to the list
      const message: Message = {
        id: Date.now().toString(),
        sender: address || '',
        content: newMessage,
        timestamp: Date.now()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header with MinPay Status */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Trade #{tradeId}</h3>
            <p className="text-sm text-gray-500">
              Trading with: {counterparty.slice(0, 6)}...{counterparty.slice(-4)}
            </p>
          </div>
          {paymentMethod === 'MiniPay' && (
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                minPayStatus === 'completed' ? 'bg-green-100 text-green-800' :
                minPayStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                MinPay: {minPayStatus.charAt(0).toUpperCase() + minPayStatus.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages with MinPay Styling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isSystem
                ? 'justify-center'
                : message.sender === address
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            {message.isSystem ? (
              <div className={`rounded-lg px-4 py-2 max-w-sm ${
                message.isMinPay ? 'bg-blue-50 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            ) : (
              <div
                className={`flex flex-col ${
                  message.sender === address ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-sm ${
                    message.sender === address
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MinPay Quick Actions */}
      {paymentMethod === 'MiniPay' && (
        <div className="px-4 py-2 border-t border-gray-200 bg-blue-50">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleMinPayAction('confirm')}
              disabled={minPayStatus !== 'pending' || isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                minPayStatus === 'pending' && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm MinPay
            </button>
            <button
              onClick={() => handleMinPayAction('complete')}
              disabled={minPayStatus !== 'processing' || isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                minPayStatus === 'processing' && !isLoading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete Transfer
            </button>
            <button
              onClick={() => handleMinPayAction('cancel')}
              disabled={minPayStatus === 'completed' || isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick Responses */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {paymentMethod === 'MiniPay' ? (
            <>
              <button
                onClick={() => setNewMessage('MinPay transfer initiated, please check')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full whitespace-nowrap hover:bg-gray-200"
              >
                MinPay Initiated
              </button>
              <button
                onClick={() => setNewMessage('MinPay transfer confirmed, please verify')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full whitespace-nowrap hover:bg-gray-200"
              >
                MinPay Confirmed
              </button>
              <button
                onClick={() => setNewMessage('Please provide your MinPay ID')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full whitespace-nowrap hover:bg-gray-200"
              >
                Request MinPay ID
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setNewMessage('Payment sent, please check')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full whitespace-nowrap hover:bg-gray-200"
              >
                Payment sent
              </button>
              <button
                onClick={() => setNewMessage('Payment received, releasing funds')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full whitespace-nowrap hover:bg-gray-200"
              >
                Payment received
              </button>
              <button
                onClick={() => setNewMessage('Please provide payment details')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full whitespace-nowrap hover:bg-gray-200"
              >
                Request details
              </button>
            </>
          )}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg ${
              isLoading || !newMessage.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}
          >
            Send
          </button>
        </div>
      </form>

      {/* Trade Actions */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">Trade Status</p>
            <p className="text-sm text-gray-500">
              {paymentMethod === 'MiniPay' 
                ? `MinPay: ${minPayStatus.charAt(0).toUpperCase() + minPayStatus.slice(1)}`
                : 'Waiting for payment'
              }
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              onClick={() => {
                // Handle cancel trade
              }}
            >
              Cancel Trade
            </button>
            <button
              className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => {
                // Handle release funds
              }}
              disabled={paymentMethod === 'MiniPay' && minPayStatus !== 'completed'}
            >
              Release Funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 