import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ManageSidebar } from "@/components/guardian/ManageSidebar";
import { getGuardianSetup } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Search, Brain, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  type Importance, type Memory,
  buildMockMemories, importanceOrder, importanceBorderColors, formatDate, PAGE_SIZE,
} from "@/lib/mockMemories";

interface GuardianMemoryBankProps {
  isLearnerView?: boolean;
  learnerName?: string;
}

export default function GuardianMemoryBank({ isLearnerView = false, learnerName }: GuardianMemoryBankProps) {
  const navigate = useNavigate();
  const data = getGuardianSetup();
  const guardianName = data?.guardianName || "Tree Guardian";
  const learners = data?.learners || [{ name: "Jake" }, { name: "Mia" }];

  const [allMemories, setAllMemories] = useState<Record<string, Memory[]>>(() =>
    buildMockMemories(guardianName, learners)
  );

  const [selectedPerson, setSelectedPerson] = useState(
    isLearnerView && learnerName ? learnerName : guardianName
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"importance" | "recent">("importance");
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editText, setEditText] = useState("");
  const [editImportance, setEditImportance] = useState<Importance>("medium");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeView, setActiveView] = useState<"guardian" | "dashboard" | "skillSelection" | number>("guardian");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const memories = allMemories[selectedPerson] || [];

  const personOptions = isLearnerView
    ? [{ value: learnerName || "", label: learnerName || "" }]
    : [
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allVisibleSelected = paginatedItems.length > 0 && paginatedItems.every(m => selectedIds.has(m.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      // Deselect only current page items
      setSelectedIds(prev => {
        const next = new Set(prev);
        paginatedItems.forEach(m => next.delete(m.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        paginatedItems.forEach(m => next.add(m.id));
        return next;
      });
    }
  };

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
        owner: selectedPerson,
      };
      setAllMemories(prev => ({
        ...prev,
        [selectedPerson]: [newMemory, ...(prev[selectedPerson] || [])],
      }));
      setIsCreating(false);
      setEditingMemory(null);
      setCurrentPage(1);
      return;
    }
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
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    setAllMemories(prev => ({
      ...prev,
      [selectedPerson]: (prev[selectedPerson] || []).filter(m => !selectedIds.has(m.id)),
    }));
    setSelectedIds(new Set());
    setBulkDeleteConfirm(false);
  };

  const handleSidebarViewChange = (view: "guardian" | "dashboard" | "skillSelection" | number) => {
    if (typeof view === "number") {
      navigate("/learner");
      return;
    }
    setActiveView(view);
  };

  const handlePersonChange = (v: string) => {
    setSelectedPerson(v);
    setSearch("");
    setSelectedIds(new Set());
    setCurrentPage(1);
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };

  const handleSortChange = (v: string) => {
    setSortBy(v as "importance" | "recent");
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ManageSidebar
          learners={learners}
          guardianName={guardianName}
          activeView={activeView}
          onSelectView={handleSidebarViewChange}
          onCreateSkill={() => {}}
        />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-4">
            <SidebarTrigger className="mr-2" />
            <Brain className="h-5 w-5 mr-2 text-primary" />
            <h1 className="text-lg font-semibold">Memory Bank</h1>
          </header>

          <main className="p-6">
            {/* Controls row */}
            <div className="flex items-center gap-3 mb-4">
              {!isLearnerView && personOptions.length > 1 ? (
                <Select value={selectedPerson} onValueChange={handlePersonChange}>
                  <SelectTrigger className="w-48 [&>span]:truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {personOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 px-3 flex items-center rounded-md border border-input bg-background text-sm font-medium w-48 truncate">
                  {selectedPerson}
                </div>
              )}

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search memories..."
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="importance">Sort by: Importance</SelectItem>
                  <SelectItem value="recent">Sort by: Recency</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="h-10 px-4 flex-shrink-0 text-sm gap-1.5"
                onClick={() => {
                  setIsCreating(true);
                  setEditingMemory({ id: "", text: "", importance: "medium", createdAt: new Date(), owner: selectedPerson });
                  setEditText("");
                  setEditImportance("medium");
                }}
              >
                <Plus className="h-4 w-4" />
                Add Memory
              </Button>
            </div>

            {/* Memory table */}
            <div className="border rounded-lg overflow-hidden relative">
              {/* Header */}
              <div className="grid grid-cols-[2rem_1fr_5.5rem_5rem_1.5rem] gap-2 px-4 py-2 border-b bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide items-center">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allVisibleSelected && paginatedItems.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all on this page"
                    disabled={paginatedItems.length === 0}
                  />
                </div>
                <span>Memory</span>
                <span className="text-center">Importance</span>
                <span className="text-right">Created</span>
                <span />
              </div>

              {/* Rows */}
              {paginatedItems.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  {search ? "No memories match your search." : "No memories yet."}
                </div>
              )}
              {paginatedItems.map((memory) => (
                <div
                  key={memory.id}
                  className={`grid grid-cols-[2rem_1fr_5.5rem_5rem_1.5rem] gap-2 px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors group items-center ${selectedIds.has(memory.id) ? "bg-muted/30" : ""}`}
                >
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedIds.has(memory.id)}
                      onCheckedChange={() => toggleSelect(memory.id)}
                      aria-label={`Select memory: ${memory.text}`}
                    />
                  </div>
                  <p
                    className="text-sm truncate min-w-0 cursor-pointer"
                    onClick={() => handleEdit(memory)}
                  >
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

              {/* Bulk action bar */}
              {someSelected && (
                <div className="sticky bottom-0 border-t bg-background px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedIds.size} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedIds(new Set())}
                    >
                      Deselect All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setBulkDeleteConfirm(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === safePage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>

      {/* Edit/Create Modal */}
      <Dialog open={!!editingMemory} onOpenChange={(open) => { if (!open) { setEditingMemory(null); setIsCreating(false); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Add Memory" : "Edit Memory"}</DialogTitle>
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
              <Button onClick={handleSaveEdit}>{isCreating ? "Add" : "Save"}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirmation */}
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

      {/* Bulk Delete Confirmation */}
      <Dialog open={bulkDeleteConfirm} onOpenChange={(open) => !open && setBulkDeleteConfirm(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.size} {selectedIds.size === 1 ? "memory" : "memories"}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove {selectedIds.size} selected {selectedIds.size === 1 ? "memory" : "memories"}.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBulkDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
