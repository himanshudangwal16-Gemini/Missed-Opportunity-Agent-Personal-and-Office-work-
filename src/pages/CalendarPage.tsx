import React, { useState, useEffect } from 'react';
import { Calendar, Zap, Plus, Sync2, Settings } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  source: 'google' | 'microsoft' | 'local';
  description?: string;
}

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed' | 'error'>('idle');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [microsoftConnected, setMicrosoftConnected] = useState(false);

  useEffect(() => {
    fetchCalendarEvents();
    checkCalendarConnections();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      const response = await fetch('/api/calendar/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    }
  };

  const checkCalendarConnections = async () => {
    try {
      const response = await fetch('/api/calendar/connections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGoogleConnected(data.google?.isConnected || false);
        setMicrosoftConnected(data.microsoft?.isConnected || false);
      }
    } catch (error) {
      console.error('Failed to check calendar connections:', error);
    }
  };

  const syncCalendar = async (provider: 'google' | 'microsoft') => {
    setSyncStatus('syncing');
    try {
      const response = await fetch(`/api/calendar/sync/${provider}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(prev => [...prev, ...data.newEvents]);
        setSyncStatus('completed');
        setTimeout(() => setSyncStatus('idle'), 2000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  const connectCalendar = async (provider: 'google' | 'microsoft') => {
    window.location.href = `/api/calendar/connect/${provider}`;
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calendar Integration</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
          <button
            onClick={() => checkCalendarConnections()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Google Calendar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Google Calendar</h3>
              <p className="text-sm text-gray-600 mt-1">
                {googleConnected ? '✅ Connected' : '⚠️ Not Connected'}
              </p>
            </div>
            {!googleConnected ? (
              <button
                onClick={() => connectCalendar('google')}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Connect
              </button>
            ) : (
              <button
                onClick={() => syncCalendar('google')}
                disabled={syncStatus === 'syncing'}
                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <Sync2 className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Microsoft Calendar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Microsoft Calendar</h3>
              <p className="text-sm text-gray-600 mt-1">
                {microsoftConnected ? '✅ Connected' : '⚠️ Not Connected'}
              </p>
            </div>
            {!microsoftConnected ? (
              <button
                onClick={() => connectCalendar('microsoft')}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Connect
              </button>
            ) : (
              <button
                onClick={() => syncCalendar('microsoft')}
                disabled={syncStatus === 'syncing'}
                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <Sync2 className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Month Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border rounded-lg ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${day.toDateString() === new Date().toDateString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <p className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                  {format(day, 'd')}
                </p>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate cursor-pointer hover:bg-blue-200"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events
            .filter(e => new Date(e.start) >= new Date())
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .slice(0, 10)
            .map(event => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(event.start), 'MMM d, yyyy h:mm a')}
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                  )}
                </div>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                  {event.source}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Timestamp Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Last updated: {new Date().toISOString()}</p>
        <p>Timezone: UTC</p>
      </div>
    </div>
  );
};
