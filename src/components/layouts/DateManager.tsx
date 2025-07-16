import { useState, useEffect, useRef, useCallback } from "react"
import { Calendar, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { fetchDateEntries, updateDateEntry } from "@/services/dateServices"
import { generateDateReportPdf } from "@/utils/datesPdf"
import useToastNotification from "@/hooks/SonnerToast"


interface DateEntry {
    date: string
    count: number
}

export interface DayData {
    date: Date
    count: number
    isCurrentMonth: boolean
    isFuture: boolean
    isToday: boolean
}

export default function DateManager() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [dateEntries, setDateEntries] = useState<DateEntry[]>([])
    const [editingCounts, setEditingCounts] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState<string | null>(null)
    const showToast = useToastNotification()

    const debounceTimers = useRef({})
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})


    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const today = new Date()
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const getDateEntries = useCallback(async () => {
        setLoading(true)
        try {
            const data = await fetchDateEntries(currentMonth, currentYear)
            setDateEntries(data)
        } catch (error) {
            console.error("Error fetching date entries:", error)
            setDateEntries([])
        } finally {
            setLoading(false)
        }
    }, [currentYear, currentMonth])

    useEffect(() => {
        getDateEntries()
        return () => {
            Object.values(debounceTimers.current).forEach(clearTimeout)
        }
    }, [currentDate])

    const updateCount = async (dateStr: string, count: number) => {
        setUpdating(dateStr)
        try {
            await updateDateEntry(dateStr, count)
            setDateEntries(prev =>
                prev.some(e => e.date === dateStr)
                    ? prev.map(entry =>
                        entry.date === dateStr ? { ...entry, count } : entry
                    )
                    : [...prev, { date: dateStr, count }]
            )
            showToast(`Updated count ${count} on ${dateStr}`, "success")
        } catch (error) {
            console.error("Error updating count:", error)
        } finally {
            setUpdating(null)
        }
    }

    const generateCalendarDays = (): DayData[] => {
        const firstDay = new Date(currentYear, currentMonth, 1)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - firstDay.getDay())

        const days: DayData[] = []
        const current = new Date(startDate)

        for (let i = 0; i < 42; i++) {
            const dateStr = current.toLocaleDateString("en-CA")
            const entry = dateEntries.find((e) => e.date === dateStr)

            days.push({
                date: new Date(current),
                count: entry?.count || 0,
                isCurrentMonth: current.getMonth() === currentMonth,
                isFuture: current > today,
                isToday: current.toDateString() === today.toDateString(),
            })

            current.setDate(current.getDate() + 1)
        }

        return days
    }

    const handleCountChange = (date: Date, value: string) => {
        const dateStr = date.toLocaleDateString("en-CA")
        setEditingCounts((prev) => ({ ...prev, [dateStr]: value }))

        // Clear previous debounce if any
        if (debounceTimers.current[dateStr]) {
            clearTimeout(debounceTimers.current[dateStr])
        }

        // New debounce
        debounceTimers.current[dateStr] = setTimeout(() => {
            const finalValue = parseInt(value) || 0
            updateCount(dateStr, finalValue)

            setEditingCounts((prev) => {
                const { [dateStr]: _, ...rest } = prev
                return rest
            })

            delete debounceTimers.current[dateStr]
        }, 1000)
    }

    const navigateMonth = (dir: "prev" | "next") => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() + (dir === "next" ? 1 : -1))
        setCurrentDate(newDate)
    }

    const handleMonthChange = (val: string) => {
        setCurrentDate(new Date(currentYear, parseInt(val), 1))
    }

    const handleYearChange = (val: string) => {
        setCurrentDate(new Date(parseInt(val), currentMonth, 1))
    }

    const calendarDays = generateCalendarDays()
    const totalCount = dateEntries.reduce((sum, e) => sum + e.count, 0)

    return (
        <div className="max-w-4xl mx-auto p-2 sm:p-6 space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex gap-2 items-center">
                            <Calendar className="h-5 w-5" />
                            Date Count Manager
                        </div>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 shadow-md"
                            onClick={() => {
                                if (totalCount === 0) {
                                    showToast("No data to export for this month.", "error")
                                    return;
                                }
                                const confirmed = window.confirm("Do you want to download the PDF report?");
                                if (!confirmed) return;
                                generateDateReportPdf({ currentYear, currentMonth, days: calendarDays, total: totalCount })
                            }}

                        >
                            Export PDF
                            <Download className="w-4 h-4" />

                        </Button>

                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-2">
                        {/* Navigation */}
                        <div className="flex items-center gap-2 p-2 ">
                            <Button className="shadow-theme-box-left" variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                                <ChevronLeft className="h-4 w-4 " />
                            </Button>

                            <div className="flex gap-2 ">
                                {/* months */}
                                <Select value={currentMonth.toString()} onValueChange={handleMonthChange} >
                                    <SelectTrigger className="w-32 shadow-lg" >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month, index) => (
                                            <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* year */}
                                <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                                    <SelectTrigger className="w-20 shadow-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="outline" size="icon" className="shadow-theme-box-right" onClick={() => navigateMonth("next")}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Total Count  and select Today*/}
                        <div className="flex gap-3.5 justify-between">
                            <Button
                                className="shadow-lg"
                                variant="outline"
                                onClick={() => {
                                    setCurrentDate(today)
                                    const todayStr = today.toLocaleDateString("en-CA")
                                    let attempts = 0
                                    const tryFocus = () => {
                                        const input = inputRefs.current[todayStr]
                                        if (input) {
                                            input.scrollIntoView({ behavior: "smooth", block: "center" })
                                            input.focus()
                                        } else if (attempts < 5) {
                                            attempts++
                                            setTimeout(tryFocus, 200)
                                        } else {
                                            console.warn("Could not focus input after multiple attempts")
                                        }
                                    }

                                    setTimeout(tryFocus, 200)
                                }}
                            >
                                Select Today
                            </Button>
                            <div className=" items-center gap-2 shadow-lg pl-2 rounded-md bg-secondary">
                                <span className="text-sm font-medium">Total:</span>
                                <Badge variant="secondary" className="text-lg px-3  pb-1">
                                    {totalCount}
                                </Badge>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
                <CardContent className="p-2 sm:p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                                <div key={d} className="text-center font-medium text-muted-foreground">{d}</div>
                            ))}

                            {calendarDays.map((day, i) => {
                                const dateStr = day.date.toLocaleDateString("en-CA")
                                const isUpdating = updating === dateStr
                                const value = editingCounts[dateStr] ?? day.count.toString()

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "sm:p-2 p-1 border rounded-lg transition-colors",
                                            day.isCurrentMonth ? "bg-gray-300" : "bg-muted/30",
                                            day.isToday && "ring-2 ring-primary",
                                            day.isFuture && "opacity-60",
                                        )}
                                    >
                                        <div className="text-center mb-1 text-sm">
                                            <span className={cn(day.isToday && "font-bold")}>
                                                {day.date.getDate()}
                                            </span>
                                        </div>

                                        <div className="flex justify-center">
                                            <Input
                                                ref={(el) => {
                                                    inputRefs.current[dateStr] = el
                                                }}
                                                type="number"
                                                min="0"
                                                value={value}
                                                onChange={(e) => handleCountChange(day.date, e.target.value)}
                                                disabled={!day.isCurrentMonth || day.isFuture || isUpdating}
                                                className={cn(
                                                    day.count > 0 ? "text-black" : "text-gray-400",
                                                    "h-8 text-center text-sm w-6 sm:w-16 p-0 rounded-md transition-all",
                                                    "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                                                    "[appearance:textfield]",
                                                )}
                                            />
                                        </div>

                                        {isUpdating && (
                                            <div className="flex justify-center mt-1">
                                                <div className="animate-spin rounded-full h-3 w-3 border border-primary border-t-transparent"></div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
