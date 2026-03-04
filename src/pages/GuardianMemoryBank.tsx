import { useState, useMemo } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ManageSidebar } from "@/components/guardian/ManageSidebar";
import { getGuardianSetup } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Search, Brain } from "lucide-react";

type Importance = "high" | "medium" | "low";

interface Memory {
  id: string;
  text: string;
  importance: Importance;
  createdAt: Date;
}

const MOCK_MEMORIES: Memory[] = [
  { id: "1", text: "Student knows a light tan spark plug color does not need replacing", importance: "high", createdAt: new Date() },
  { id: "2", text: "Prefers story-based lessons over direct practice", importance: "high", createdAt: new Date() },
  { id: "3", text: "Student does landscaping work", importance: "medium", createdAt: new Date(Date.now() - 86400000) },
  { id: "4", text: "Likes YouTube channels RAR Garage and Dude Perfect", importance: "low", createdAt: new Date(Date.now() - 86400000) },
  { id: "5", text: "Student associates a white or chalky spark plug with too much air", importance: "high", createdAt: new Date(Date.now() - 86400000 * 2) },
  { id: "6", text: "Knows to lift with legs when tilting or lifting a lawn mower", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 2) },
  { id: "7", text: "Student wants to do lawnmower lessons", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 3) },
  { id: "8", text: "Did not know basic lawn mower maintenance steps", importance: "high", createdAt: new Date(Date.now() - 86400000 * 3) },
  { id: "9", text: "Says sturdy boots should be worn for landscaping to protect feet", importance: "low", createdAt: new Date(Date.now() - 86400000 * 4) },
  { id: "10", text: "Plans to use safety gear when doing maintenance", importance: "low", createdAt: new Date(Date.now() - 86400000 * 5) },
  { id: "11", text: "Knows about horizontal directional drilling and has seen it used for fiber optics", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 6) },
  { id: "12", text: "Says preventing accidents in HDD is crucial to avoid breaking a gas main", importance: "high", createdAt: new Date(Date.now() - 86400000 * 7) },
];

function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = today.getTime() - target.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

const importanceOrder: Record<Importance, number> = { high: 0, medium: 1, low: 2 };

const importanceColors: Record<Importance, string> = {
  high: "text-destructive",
  medium: "text-chart-4",
  low: "text-muted-foreground",
};

const importanceBgColors: Record<Importance, string> = {
  high: "bg-destructive/10",
  medium: "bg-chart-4/10",
  low: "bg-muted",
};

export default function GuardianMemoryBank() {
  const data = getGuardianSetup();
  const guardianName = data?.guardianName || "Tree Guardian";
  const learners = data?.learners || [{ name: "Jake" }, { name: "Mia" }];

  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"importance" | "recent">("importance");
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editText, setEditText] = useState("");
  const [editImportance, setEditImportance] = useState<Importance>("medium");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = memories;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m => m.text.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "importance") {
        const diff = importanceOrder[a.importance] - importanceOrder[b.importance];
        if (diff !== 0) return diff;
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    return result;
  }, [memories, search, sortBy]);

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setEditText(memory.text);
    setEditImportance(memory.importance);
  };

  const handleSaveEdit = () => {
    if (!editingMemory) return;
    setMemories(prev => prev.map(m =>
      m.id === editingMemory.id ? { ...m, text: editText, importance: editImportance } : m
    ));
    setEditingMemory(null);
  };

  const handleDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ManageSidebar
          learners={learners}
          guardianName={guardianName}
          activeView="guardian"
          onSelectView={() => {}}
          onCreateSkill={() => {}}
        />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-4">
            <SidebarTrigger className="mr-2" />
            <Brain className="h-5 w-5 mr-2 text-primary" />
            <h1 className="text-lg font-semibold">Memory Bank</h1>
          </header>

          <main className="p-6 max-w-4xl mx-auto">
            <div className="mb-1">
              <p className="text-muted-foreground text-sm">
                {memories.length} memories saved
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search memories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "importance" | "recent")}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="importance">By importance</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Memory List */}
            <div className="border rounded-lg divide-y divide-border">
              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  {search ? "No memories match your search." : "No memories yet."}
                </div>
              )}
              {filtered.map((memory) => (
                <div
                  key={memory.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
                >
                  {/* Memory text */}
                  <p className="flex-1 text-sm truncate min-w-0 cursor-pointer" onClick={() => handleEdit(memory)}>
                    {memory.text}
                  </p>

                  {/* Importance badge */}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap capitalize ${importanceColors[memory.importance]} ${importanceBgColors[memory.importance]}`}>
                    {memory.importance}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground whitespace-nowrap w-16 text-right">
                    {formatDate(memory.createdAt)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(memory)}
                      className="p-1.5 rounded-md hover:bg-accent transition-colors"
                      aria-label="Edit memory"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(memory.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingMemory} onOpenChange={(open) => !open && setEditingMemory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Memory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Memory</label>
              <Textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Importance</label>
              <Select value={editImportance} onValueChange={(v) => setEditImportance(v as Importance)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editingMemory && (
              <p className="text-xs text-muted-foreground">
                Created: {formatDate(editingMemory.createdAt)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMemory(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete memory?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This memory will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
