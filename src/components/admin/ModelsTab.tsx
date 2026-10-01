import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Settings2, Cpu } from "lucide-react";
import { useAuth } from "../AuthContext";

export function ModelsTab() {
  const { token } = useAuth();
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, [token]);

  const fetchModels = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/models', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      const modelsData = await response.json();
      setModels(modelsData);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModel = async (model: any) => {
    if (!token) return;
    const newEnabled = !model.enabled;
    try {
      const response = await fetch(`/api/admin/models/${model.id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: newEnabled })
      });
      if (!response.ok) throw new Error();
      setModels(models.map(m => m.id === model.id ? { ...m, enabled: newEnabled } : m));
    } catch (error) {
      console.error("Error toggling model:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">AI Model Configuration</h3>
          <p className="text-sm text-zinc-500">Manage available models and their settings.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-zinc-500">Loading models...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {models.map((model) => (
            <Card key={model.id} className={`bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 transition-all ${!model.enabled ? 'opacity-60 grayscale' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{model.name}</CardTitle>
                      <CardDescription className="text-xs">{model.provider}</CardDescription>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={model.enabled}
                      onChange={() => toggleModel(model)}
                    />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 h-10">
                  {model.description}
                </p>
                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
                  <Button variant="outline" size="sm" className="border-black/10 dark:border-white/10" disabled={!model.enabled}>
                    <Settings2 className="w-4 h-4 mr-2" />
                    Configure Rules
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
