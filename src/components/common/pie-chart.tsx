import { ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import type { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PieChartVisualProps{
    title:string;
    chartConfig:ChartConfig;
    chartData:{}[];
    dataKey:string;
    nameKey:string;
}

export default function PieChartVisual({title,chartConfig,chartData,dataKey,nameKey}:PieChartVisualProps) {
    return(
        <Card className="gap-1 pb-1 pt-5 h-full grid grid-rows-[auto_auto]">
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center w-full">
              <div className="w-full h-full mx-auto my-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig}>
                    <PieChart margin={{top:2, right:2, left:2, bottom:2}}>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Legend layout="vertical" verticalAlign="middle" align="right"/>
                      <Pie 
                        data={chartData} 
                        dataKey={dataKey} 
                        nameKey={nameKey} 
                        outerRadius="75%" 
                        cx="45%"
                        cy="53%"
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