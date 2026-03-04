import { useState, useMemo } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { getGuardianSetup } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Search, Brain, Plus } from "lucide-react";

type Importance = "high" | "medium" | "low";

interface Memory {
  id: string;
  text: string;
  importance: Importance;
  createdAt: Date;
}

function buildLearnerMockMemories(learnerName: string): Memory[] {
  // Different mock data depending on learner name
  if (learnerName === "Jake") {
    return [
      { id: "l1-1", text: "Knows a light tan spark plug color does not need replacing", importance: "high", createdAt: new Date() },
      { id: "l1-2", text: "Does landscaping work and wants to learn mower maintenance", importance: "high", createdAt: new Date(Date.now() - 86400000) },
      { id: "l1-3", text: "Likes YouTube channels RAR Garage and Dude Perfect", importance: "low", createdAt: new Date(Date.now() - 86400000) },
      { id: "l1-4", text: "Associates a white or chalky spark plug with too much air", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 2) },
      { id: "l1-5", text: "Knows to lift with legs when tilting a lawn mower", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 3) },
      { id: "l1-6", text: "Did not know basic lawn mower maintenance steps", importance: "high", createdAt: new Date(Date.now() - 86400000 * 4) },
      { id: "l1-7", text: "Says sturdy boots should be worn for landscaping", importance: "low", createdAt: new Date(Date.now() - 86400000 * 5) },
      { id: "l1-8", text: "Knows about horizontal directional drilling for fiber optics", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 6) },
    ];
  }
  if (learnerName === "Mia") {
    return [
      { id: "l2-1", text: "Enjoys math and recently solved a difficult equation", importance: "high", createdAt: new Date() },
      { id: "l2-2", text: "Plays Clash Royale every day and finds it strategic", importance: "medium", createdAt: new Date(Date.now() - 86400000) },
      { id: "l2-3", text: "Fan of Manchester United but not actively watching anymore", importance: "low", createdAt: new Date(Date.now() - 86400000 * 2) },
      { id: "l2-4", text: "Achieved Ultimate Champion rank in Clash Royale", importance: "low", createdAt: new Date(Date.now() - 86400000 * 4) },
      { id: "l2-5", text: "Specifically enjoys using the Hog Rider deck", importance: "low", createdAt: new Date(Date.now() - 86400000 * 7) },
    ];
  }
  return [];
}

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

const importanceBorderColors: Record<Importance, string> = {
  high: "border-[#EED4F0] text-[#EED4F0]",
  medium: "border-[#94DFE9] text-[#94DFE9]",
  low: "border-[#B9C6FE] text-[#B9C6FE]",
};

export default function LearnerMemoryBank() {
  const data = getGuardianSetup();
  const learners = data?.learners || [{ name: "Jake" }, { name: "Mia" }];
  // For now, use first learner as the active one (in real app, this comes from auth)
  const learnerName = learners[0]?.name || "Learner";

  const [memories, setMemories] = useState<Memory[]>(() => buildLearnerMockMemories(learnerName));
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"importance" | "recent">("importance");
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editText, setEditText] = useState("");
  const [editImportance, setEditImportance] = useState<Importance>("medium");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
    if (isCreating) {
      if (!editText.trim()) return;
      const newMemory: Memory = {
        id: `new-${Date.now()}`,
        text: editText.trim(),
        importance: editImportance,
        createdAt: new Date(),
      };
      setMemories(prev => [newMemory, ...prev]);
      setIsCreating(false);
      setEditingMemory(null);
      return;
    }
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
        <AppSidebar learnerName={learnerName} />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-4">
            <SidebarTrigger className="mr-2" />
            <Brain className="h-5 w-5 mr-2 text-primary" />
            <h1 className="text-lg font-semibold">Memory Bank</h1>
          </header>

          <main className="p-6">
            {/* Controls */}
            <div className="flex items-center gap-3 mb-4">
              {/* Learner name — read-only, no dropdown since learners only see their own */}
              <div className="h-10 px-3 flex items-center rounded-md border border-input bg-background text-sm font-medium w-48 truncate">
                {learnerName}
              </div>

              <div className="relative flex-1">
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
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 flex-shrink-0"
                onClick={() => {
                  setIsCreating(true);
                  setEditingMemory({ id: "", text: "", importance: "medium", createdAt: new Date() });
                  setEditText("");
                  setEditImportance("medium");
                }}
                aria-label="Create memory"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Memory table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[2rem_1fr_5.5rem_5rem_1.5rem] gap-2 px-4 py-2 border-b bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide items-center">
                <span />
                <span>Memory</span>
                <span className="text-center">Importance</span>
                <span className="text-right">Created</span>
                <span />
              </div>

              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  {search ? "No memories match your search." : "No memories yet."}
                </div>
              )}
              {filtered.map((memory) => (
                <div
                  key={memory.id}
                  className="grid grid-cols-[2rem_1fr_5.5rem_5rem_1.5rem] gap-2 px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors group items-center"
                >
                  <button
                    onClick={() => setDeleteConfirm(memory.id)}
                    className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
                    aria-label="Delete memory"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>

                  <p className="text-sm truncate min-w-0 cursor-pointer" onClick={() => handleEdit(memory)}>
                    {memory.text}
                  </p>

                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize border bg-transparent text-center truncate ${importanceBorderColors[memory.importance]}`}>
                    {memory.importance}
                  </span>

                  <span className="text-xs text-muted-foreground text-right whitespace-nowrap">
                    {formatDate(memory.createdAt)}
                  </span>

                  <button
                    onClick={() => handleEdit(memory)}
                    className="p-1 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Edit memory"
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Edit/Create Modal */}
      <Dialog open={!!editingMemory} onOpenChange={(open) => { if (!open) { setEditingMemory(null); setIsCreating(false); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create Memory" : "Edit Memory"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Memory</label>
              <Textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                rows={3}
                className="resize-none"
                placeholder={isCreating ? "Enter a new memory..." : ""}
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
            {!isCreating && editingMemory && (
              <p className="text-xs text-muted-foreground">
                Created: {formatDate(editingMemory.createdAt)}
              </p>
            )}
          </div>
          <DialogFooter className="flex !justify-between">
            {!isCreating ? (
              <button
                onClick={() => {
                  if (editingMemory) {
                    setEditingMemory(null);
                    setDeleteConfirm(editingMemory.id);
                  }
                }}
                className="p-2 rounded-md hover:bg-destructive/10 transition-colors"
                aria-label="Delete memory"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </button>
            ) : <span />}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setEditingMemory(null); setIsCreating(false); }}>Cancel</Button>
              <Button onClick={handleSaveEdit}>{isCreating ? "Create" : "Save"}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete memory?</DialogTitle>
          </DialogHeader>
          {deleteConfirm && (
            <p className="text-sm bg-muted/50 rounded-md p-3 my-1">
              {memories.find(m => m.id === deleteConfirm)?.text}
            </p>
          )}
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
