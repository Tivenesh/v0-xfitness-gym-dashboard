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
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">All Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Member</TableHead>
              <TableHead className="text-muted-foreground">Plan</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.name} className="border-border">
                <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.plan}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === "Active" ? "default" : "destructive"}
                    className={
                      member.status === "Active"
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.joinDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
