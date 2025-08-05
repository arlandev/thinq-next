import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import type { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AreaChartVisualProps{
    title:string;
    chartConfig:ChartConfig;
    chartData:{}[];
    dataKey:string;
    dataKey1:string;
    dataKey2:string;
    fill1:string;
    fill2:string;
}

export default function AreaChartVisual({title,chartConfig,chartData,dataKey,dataKey1,dataKey2,fill1,fill2}:AreaChartVisualProps) {
    return(
        <Card className="gap-1 pb-1 pt-5 h-full grid grid-rows-[auto_auto]">
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center w-full h-100">
              <div className="w-full h-100 mx-auto my-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top:20, left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={dataKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => String(value).slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />}/>
                        <Area
                            dataKey={dataKey1}
                            type="natural"
                            fill={fill1}
                            fillOpacity={0.4}
                            stroke={fill1}
                            stackId="a"
                        />
                        <Area
                            dataKey={dataKey2}
                            type="natural"
                            fill={fill2}
                            fillOpacity={0.4}
                            stroke={fill2}
                            stackId="b"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                    </ChartContainer>  
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
    )
}