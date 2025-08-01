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
        <Card className="gap-1 pb-1 pt-5 h-full grid grid-rows-[auto_auto]">
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center w-full">
              <div className="w-full h-full mx-auto my-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: -1, }}
                    >
                        <XAxis type="number" dataKey={dataKeyX} hide /> 
                        <YAxis
                            dataKey={dataKeyY}
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => String(value).slice(0, 10)}
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