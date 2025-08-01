import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface NumberCardProps {
    count: number;
    title: string;
}


export default function NumberCard({count, title}: NumberCardProps) {
    return (
        <Card className="gap-2 pb-2 h-full">
            <CardHeader>
                <CardTitle className="text-5xl font-bold text-center">{count}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center">{title}</p>
            </CardContent>
        </Card>
    )
}