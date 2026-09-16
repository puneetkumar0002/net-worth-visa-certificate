import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Activity, Shield, Edit, Trash, Plus, LogIn } from 'lucide-react';

export default function ActivityLogs() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action: string) => {
    if (action.includes('login')) return <LogIn className="w-4 h-4 text-blue-500" />;
    if (action.includes('create')) return <Plus className="w-4 h-4 text-green-500" />;
    if (action.includes('update') || action.includes('edit')) return <Edit className="w-4 h-4 text-amber-500" />;
    if (action.includes('delete')) return <Trash className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-slate-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0C6D62] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Activity Logs</h2>
        <p className="text-slate-500 mt-1">System audit logs for admin actions and events.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center">
              <Shield className="w-12 h-12 text-slate-300 mb-3" />
              No activity logs recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.action || '')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-semibold">{item.user || 'System'}</span> {item.action} <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'N/A'} • IP: {item.ip || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
