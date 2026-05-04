import { useMemo, useState } from "react";
import { db } from "@/data/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminUsers() {
  const [v, setV] = useState(0);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const users = useMemo(() => db.listUsers().filter(u =>
    (role === "all" || u.role === role) &&
    (q === "" || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()))
  ), [v, q, role]);

  const remove = (id: number) => {
    if (!confirm("Delete this user?")) return;
    db.deleteUser(id); toast.success("User deleted"); setV(x => x + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">User Management</h1>
        <p className="text-muted-foreground mt-1">All users registered on the platform</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users…" className="pl-9" />
        </div>
        <Tabs value={role} onValueChange={setRole}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="instructor">Instructors</TabsTrigger>
            <TabsTrigger value="student">Students</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">{users.length} users</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>ID</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge className="capitalize" variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.studentId || `#${u.id}`}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(u.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
