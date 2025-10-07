import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const members = [
  {
    name: "Ethan Harper",
    plan: "Premium",
    status: "Active",
    joinDate: "2023-01-15",
  },
  {
    name: "Olivia Bennett",
    plan: "Standard",
    status: "Active",
    joinDate: "2023-02-20",
  },
  {
    name: "Noah Carter",
    plan: "Basic",
    status: "Inactive",
    joinDate: "2023-03-01",
  },
  {
    name: "Ava Reynolds",
    plan: "Premium",
    status: "Active",
    joinDate: "2023-04-10",
  },
  {
    name: "Liam Foster",
    plan: "Standard",
    status: "Active",
    joinDate: "2023-05-25",
  },
]

export function AllMembersTable() {
  return (
    <Card className="bg-black border-2 border-white/10 hover:border-primary/50 transition-all rounded-none">
      <CardHeader>
        <CardTitle className="text-white font-black uppercase tracking-wide">All Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 font-bold uppercase text-xs">Member</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Plan</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Status</TableHead>
              <TableHead className="text-white/70 font-bold uppercase text-xs">Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.name} className="border-white/10 hover:bg-white/5 transition-colors">
                <TableCell className="font-bold text-white">{member.name}</TableCell>
                <TableCell className="text-white/70">{member.plan}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === "Active" ? "default" : "destructive"}
                    className={
                      member.status === "Active"
                        ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-none font-bold"
                        : "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 rounded-none font-bold"
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/70">{member.joinDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
