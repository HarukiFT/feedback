"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { CalendarIcon, Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar } from "recharts";
import { Tooltip, XAxis } from "recharts";
import { CartesianGrid } from "recharts";
import { BarChart } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { set } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const feedbackTypes = [
  "Благодарность",
  "Жалоба",
  "Баг",
  "Предложение",
  "Вопрос",
  "Троллинг",
];

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];
const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const FeedbackPage = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [data, setData] = useState<
    {
      sender: number;
      text: string;
      type: string;
      rating: number;
      summary: string;
      timestamp: string;
    }[]
  >([]);
  const [metrics, setMetrics] = useState<
    {
      date: string;
      count: string;
    }[]
  >([]);

  useEffect(() => {
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + "feedback/get", {
        limit: 15,
        page: 1,
        filters: {
          type: selectedType.toLowerCase(),
          rating: selectedStar,
          startDate: fromDate,
          endDate: toDate,
        },
      })
      .then((response) => {
        setData(response.data.data);
        setTotalPages(response.data.pagination.pages);
      });
  }, [selectedType, selectedStar, fromDate, toDate, currentPage]);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "feedback/counts")
      .then((response) => {
        setMetrics(response.data);
      });
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow">
        <div className="grid grid-cols-6 gap-4 px-5">
          <div className="flex flex-col col-start-1 col-end-6 py-5">
            <div className="flex gap-4">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="default" size={"lg"}>
                    {selectedType !== "" ? selectedType : "Тип"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[150px] p-0">
                  <Command>
                    <CommandInput placeholder="Найти тип...." />
                    <CommandList>
                      <CommandEmpty>Ничего не найдено</CommandEmpty>

                      {feedbackTypes.map((type) => (
                        <CommandItem
                          value={type}
                          onSelect={() => {
                            setSelectedType(type);
                            setIsOpen(false);
                            setCurrentPage(1);
                          }}
                          key={type}
                        >
                          {type}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedType === type
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={"lg"}>
                    {selectedStar && selectedStar !== 0 ? (
                      <>
                        <Star />
                        {selectedStar}
                      </>
                    ) : (
                      "Оценка"
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem
                    key={"null"}
                    onSelect={() => {
                      setSelectedStar(null);
                      setCurrentPage(1);
                    }}
                  >
                    Без разницы
                  </DropdownMenuItem>
                  {[1, 2, 3, 4, 5].map((star) => {
                    return (
                      <DropdownMenuItem
                        key={star}
                        onSelect={() => {
                          setSelectedStar(star);
                          setCurrentPage(1);
                        }}
                      >
                        <Star
                          className={cn(
                            "w-4 h-4",
                            selectedStar === star ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {star}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"secondary"}
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? (
                      toDate ? (
                        <>
                          {fromDate.toLocaleDateString("ru-RU")} -{" "}
                          {toDate.toLocaleDateString("ru-RU")}
                        </>
                      ) : (
                        fromDate.toLocaleDateString("ru-RU")
                      )
                    ) : (
                      "Интервал"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    selected={{
                      from: fromDate,
                      to: toDate,
                    }}
                    mode="range"
                    onSelect={(range) => {
                      setFromDate(range?.from);
                      setToDate(range?.to);
                      setCurrentPage(1);
                    }}
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Предыдущая
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant={currentPage === 1 ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>
                  {currentPage > 3 && <span className="px-2">...</span>}
                  {currentPage > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </Button>
                  )}
                  {currentPage !== 1 && currentPage !== totalPages && (
                    <Button variant="secondary" size="sm">
                      {currentPage}
                    </Button>
                  )}
                  {currentPage < totalPages - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </Button>
                  )}
                  {currentPage < totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}
                  {totalPages > 1 && (
                    <Button
                      variant={
                        currentPage === totalPages ? "secondary" : "ghost"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Следующая
                </Button>
              </div>
            </div>

            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Отправитель</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Текст</TableHead>
                    <TableHead>Краткое содержание</TableHead>
                    <TableHead>Оценка</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.sender}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="overflow-auto">
                        {item.text}
                      </TableCell>
                      <TableCell className="overflow-auto">
                        {item.summary}
                      </TableCell>
                      <TableCell>{item.rating}</TableCell>
                      <TableCell>
                        {new Date(item.timestamp).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col col-start-6 col-end-7 py-5">
            <h1 className="text-2xl font-bold">Feedback</h1>
          </div>
        </div>
      </div>

      <Card className="w-full p-4">
        <CardContent className="items-center justify-center flex h-[175px] w-full">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <AreaChart
              accessibilityLayer
              data={metrics}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("ru-RU", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="count"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("ru-RU", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-1))"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
