import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-3xl">My Profile</h1>
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-20 w-20"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
          <div>
            <div className="font-display text-xl">{user.name}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
            <Badge className="mt-2 capitalize">{user.role}</Badge>
            {user.studentId && <div className="text-xs text-muted-foreground mt-1">Student ID: {user.studentId}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
