import { ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartVisualHorizontalProps{
    title:string;
    chartConfig:ChartConfig;
    chartData:{}[];
    dataKeyX:string;
    dataKeyY:string;
    fill:string;
}

export default function BarChartVisualHorizontal({title,chartConfig,chartData,dataKeyX,dataKeyY,fill}:BarChartVisualHorizontalProps) {
    return(
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <div className="w-full h-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, left: 75, right: 20, bottom: 20 }}
                    >
                        <XAxis type="number" dataKey={dataKeyX} hide /> 
                        <YAxis
                            dataKey={dataKeyY}
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />}/>
                        <Bar dataKey={dataKeyX} fill={fill} radius={5} />
                    </BarChart>
                  </ChartContainer>  
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
    )
}