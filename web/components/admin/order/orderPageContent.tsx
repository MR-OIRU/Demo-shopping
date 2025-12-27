"use client";

import { useOrders } from "@/hooks/use-order";
import OrderListTable from "../tables/order/orderList";
import { useMemo, useState } from "react";
import { format, startOfDay, subDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { OrderTabs } from "@/components/shared/status/order";
import { OrderTabValue } from "@/types";

export default function OrderPageContent() {
    const [statusTab, setStatusTab] = useState<OrderTabValue>("all");
    const [startDate, setStartDate] = useState<Date>(() => subDays(new Date(), 7));
    const [endDate, setEndDate] = useState<Date>(() => startOfDay(new Date()));
    
    const start = startDate ? format(startDate, "yyyy-MM-dd") : "";
    const end = endDate ? format(endDate, "yyyy-MM-dd") : "";
    const enabled = !!startDate && !!endDate;

    const { data, refetch } = useOrders(start, end, enabled);

    const ORDER_TABS = OrderTabs();
    
    const filteredData = useMemo(() => {
        if (statusTab === "all") return data ?? [];
        return (data ?? []).filter((item) => item.status === statusTab);
    }, [data, statusTab]);
    return (
        <>
            <Card>
                <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-col xl:flex-row justify-between gap-3">
                        <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as OrderTabValue)}>
                            <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-fit w-full gap-3">
                                {ORDER_TABS.map((item) => (
                                    <TabsTrigger className="cursor-pointer" key={item.value} value={item.value}>
                                        {item.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                        <div className="flex flex-1 items-center justify-between sm:justify-end gap-1 sm:gap-3">
                            <div className="flex w-full xl:w-auto">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="start-date"
                                            className="w-full justify-between font-normal xl:w-60"
                                        >
                                            {startDate ? format(startDate, "dd/MM/yyyy") : "วันที่เริ่มต้น"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                if (date) setStartDate(date);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <span className="text-muted-foreground text-sm">ถึง</span>
                            <div className="flex w-full xl:w-auto">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="end-date"
                                            className="w-full justify-between font-normal xl:w-60"
                                        >
                                            {endDate ? format(endDate, "dd/MM/yyyy") : "วันที่สิ้นสุด"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                if (date) setEndDate(date);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1">
                        <OrderListTable data={filteredData || []} refetch={refetch} />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
