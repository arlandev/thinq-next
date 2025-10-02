import { ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import type { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PieChartVisualProps{
    title:string;
    chartConfig:ChartConfig;
    chartData:{}[];
    dataKey:string;
    nameKey:string;
}

export default function PieChartVisual({title,chartConfig,chartData,dataKey,nameKey}:PieChartVisualProps) {
    return(
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 flex items-center justify-center">
              <div className="w-full max-w-md flex items-center justify-center">
                <ResponsiveContainer width="100%" height="20%">
                  <ChartContainer config={chartConfig}>
                    <PieChart margin={{top: 0, right: 2, left: 2, bottom: 5}}>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Legend layout="vertical" verticalAlign="middle" align="right"/>
                      <Pie 
                        data={chartData} 
                        dataKey={dataKey} 
                        nameKey={nameKey} 
                        outerRadius="80%" 
                        cx="45%"
                        cy="45%"
                        label
                      />
                    </PieChart>
                  </ChartContainer>  
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
    )
}