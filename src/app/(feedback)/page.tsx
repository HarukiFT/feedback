"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import axios from "axios";
import { CalendarIcon, Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart } from "recharts";
import { Tooltip, XAxis } from "recharts";
import { CartesianGrid } from "recharts";
import { Calendar } from "@/components/ui/calendar";
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
