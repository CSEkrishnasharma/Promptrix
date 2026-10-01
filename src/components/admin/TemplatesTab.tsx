import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Edit2, Trash2, Globe, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useAuth } from "../AuthContext";

export function TemplatesTab() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [templateToDelete, setTemplateToDelete] = useState<any>(null);
  const [templateToEdit, setTemplateToEdit] = useState<any>(null);

  useEffect(() => {
    fetchTemplates();
  }, [token]);

  const fetchTemplates = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      const templatesData = await response.json();
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!token) return;
    const newTemplate = {
      title: "New Custom Template",
      description: "Description for the new template.",
      category: "Custom",
      visibility: "private"
    };
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTemplate)
      });
      if (!response.ok) throw new Error();
      const created = await response.json();
      setTemplates([...templates, created]);
    } catch (error) {
      console.error("Error adding template:", error);
    }
  };

  const handleToggleVisibility = async (template: any) => {
    if (!token) return;
    const newVisibility = template.visibility === 'public' ? 'private' : 'public';
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visibility: newVisibility })
      });
      if (!response.ok) throw new Error();
      setTemplates(templates.map(t => t.id === template.id ? { ...t, visibility: newVisibility } : t));
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  const confirmDeleteTemplate = (template: any) => {
    setTemplateToDelete(template);
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete || !token) return;
    try {
      const response = await fetch(`/api/admin/templates/${templateToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      setTemplateToDelete(null);
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleEditTemplate = (template: any) => {
    setTemplateToEdit({ ...template });
  };

  const handleSaveTemplate = async () => {
    if (!templateToEdit || !token) return;
    try {
      const response = await fetch(`/api/admin/templates/${templateToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: templateToEdit.title,
          description: templateToEdit.description,
          category: templateToEdit.category,
        })
      });
      if (!response.ok) throw new Error();
      setTemplates(templates.map(t => t.id === templateToEdit.id ? templateToEdit : t));
      setTemplateToEdit(null);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Prompt Templates</h3>
          <p className="text-sm text-zinc-500">Manage the templates available to users.</p>
        </div>
        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-zinc-500">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="bg-white/40 dark:bg-black/40 border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-all group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <CardDescription className="text-xs">{template.category}</CardDescription>
                  </div>
                  <div className="text-zinc-400 cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => handleToggleVisibility(template)}>
                    {template.visibility === 'public' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-indigo-500" onClick={() => handleEditTemplate(template)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-red-500" onClick={() => confirmDeleteTemplate(template)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{templateToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setTemplateToDelete(null)} className="border-black/10 dark:border-white/10">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!templateToEdit} onOpenChange={(open) => !open && setTemplateToEdit(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0a0a0f] border-black/10 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Modify the details of this prompt template.
            </DialogDescription>
          </DialogHeader>
          {templateToEdit && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900 dark:text-white">Title</label>
                <Input 
                  value={templateToEdit.title} 
                  onChange={(e) => setTemplateToEdit({...templateToEdit, title: e.target.value})}
                  className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900 dark:text-white">Category</label>
                <Input 
                  value={templateToEdit.category} 
                  onChange={(e) => setTemplateToEdit({...templateToEdit, category: e.target.value})}
                  className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900 dark:text-white">Description</label>
                <Textarea 
                  value={templateToEdit.description} 
                  onChange={(e) => setTemplateToEdit({...templateToEdit, description: e.target.value})}
                  className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateToEdit(null)} className="border-black/10 dark:border-white/10">Cancel</Button>
            <Button onClick={handleSaveTemplate} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
