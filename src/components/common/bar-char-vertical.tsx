import { ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartVisualVerticalProps{
    title:string;
    chartConfig:ChartConfig;
    chartData:{}[];
    dataKeyX:string;
    dataKeyY:string;
    fill:string;
}

export default function BarChartVisualVertical({title,chartConfig,chartData,dataKeyX,dataKeyY,fill}:BarChartVisualVerticalProps) {
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
                            margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey={dataKeyX}
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => String(value).slice(0, 5)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey={dataKeyY} fill={fill} radius={8} />
                        </BarChart>
                  </ChartContainer>  
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
    )
}