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
  owner: string; // person name this memory belongs to
}

function buildMockMemories(guardianName: string, learners: { name: string }[]): Record<string, Memory[]> {
  const l1 = learners[0]?.name || "Learner 1";
  const l2 = learners[1]?.name || "Learner 2";

  return {
    [guardianName]: [
      { id: "g1", text: "Prefers no emojis in any communications", importance: "high", createdAt: new Date(), owner: guardianName },
      { id: "g2", text: "Wants bullet points to follow a specific format for updates", importance: "medium", createdAt: new Date(Date.now() - 86400000), owner: guardianName },
      { id: "g3", text: "Prefers story-based lessons over direct practice for all learners", importance: "high", createdAt: new Date(Date.now() - 86400000 * 3), owner: guardianName },
      { id: "g4", text: "Running weekly check-ins with the team on Tuesdays", importance: "low", createdAt: new Date(Date.now() - 86400000 * 5), owner: guardianName },
    ],
    [l1]: [
      { id: "l1-1", text: "Knows a light tan spark plug color does not need replacing", importance: "high", createdAt: new Date(), owner: l1 },
      { id: "l1-2", text: "Does landscaping work and wants to learn mower maintenance", importance: "high", createdAt: new Date(Date.now() - 86400000), owner: l1 },
      { id: "l1-3", text: "Likes YouTube channels RAR Garage and Dude Perfect", importance: "low", createdAt: new Date(Date.now() - 86400000), owner: l1 },
      { id: "l1-4", text: "Associates a white or chalky spark plug with too much air", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 2), owner: l1 },
      { id: "l1-5", text: "Knows to lift with legs when tilting a lawn mower", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 3), owner: l1 },
      { id: "l1-6", text: "Did not know basic lawn mower maintenance steps", importance: "high", createdAt: new Date(Date.now() - 86400000 * 4), owner: l1 },
      { id: "l1-7", text: "Says sturdy boots should be worn for landscaping", importance: "low", createdAt: new Date(Date.now() - 86400000 * 5), owner: l1 },
      { id: "l1-8", text: "Knows about horizontal directional drilling for fiber optics", importance: "medium", createdAt: new Date(Date.now() - 86400000 * 6), owner: l1 },
    ],
    [l2]: [
      { id: "l2-1", text: "Enjoys math and recently solved a difficult equation", importance: "high", createdAt: new Date(), owner: l2 },
      { id: "l2-2", text: "Plays Clash Royale every day and finds it strategic", importance: "medium", createdAt: new Date(Date.now() - 86400000), owner: l2 },
      { id: "l2-3", text: "Fan of Manchester United but not actively watching anymore", importance: "low", createdAt: new Date(Date.now() - 86400000 * 2), owner: l2 },
      { id: "l2-4", text: "Achieved Ultimate Champion rank in Clash Royale", importance: "low", createdAt: new Date(Date.now() - 86400000 * 4), owner: l2 },
      { id: "l2-5", text: "Specifically enjoys using the Hog Rider deck", importance: "low", createdAt: new Date(Date.now() - 86400000 * 7), owner: l2 },
    ],
  };
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

const importanceColors: Record<Importance, string> = {
  high: "text-xolv-magenta-200",
  medium: "text-xolv-teal-200",
  low: "text-xolv-blue-200",
};

const importanceBgColors: Record<Importance, string> = {
  high: "bg-xolv-magenta-800",
  medium: "bg-xolv-teal-800",
  low: "bg-xolv-blue-800",
};

export default function GuardianMemoryBank() {
  const data = getGuardianSetup();
  const guardianName = data?.guardianName || "Tree Guardian";
  const learners = data?.learners || [{ name: "Jake" }, { name: "Mia" }];

  const [allMemories, setAllMemories] = useState<Record<string, Memory[]>>(() =>
    buildMockMemories(guardianName, learners)
  );
  const [selectedPerson, setSelectedPerson] = useState(guardianName);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"importance" | "recent">("importance");
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editText, setEditText] = useState("");
  const [editImportance, setEditImportance] = useState<Importance>("medium");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const memories = allMemories[selectedPerson] || [];

  const personOptions = [
    { value: guardianName, label: `${guardianName} (myself)` },
    ...learners.map(l => ({ value: l.name, label: l.name })),
  ];

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
    setAllMemories(prev => ({
      ...prev,
      [selectedPerson]: (prev[selectedPerson] || []).map(m =>
        m.id === editingMemory.id ? { ...m, text: editText, importance: editImportance } : m
      ),
    }));
    setEditingMemory(null);
  };

  const handleDelete = (id: string) => {
    setAllMemories(prev => ({
      ...prev,
      [selectedPerson]: (prev[selectedPerson] || []).filter(m => m.id !== id),
    }));
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

            {/* Controls */}
            <div className="flex items-center gap-3 mb-4">
              {/* Person selector */}
              <Select value={selectedPerson} onValueChange={(v) => { setSelectedPerson(v); setSearch(""); }}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {personOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  {/* Delete icon - left side */}
                  <button
                    onClick={() => setDeleteConfirm(memory.id)}
                    className="p-1 rounded-md hover:bg-destructive/10 transition-colors flex-shrink-0"
                    aria-label="Delete memory"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>

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

                  {/* Edit icon - right side, visible on hover */}
                  <button
                    onClick={() => handleEdit(memory)}
                    className="p-1 rounded-md hover:bg-accent transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
          <DialogFooter className="flex !justify-between">
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingMemory(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
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
