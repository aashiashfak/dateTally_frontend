import { useState, useEffect, useCallback } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { fetchDateEntries, updateDateEntry } from "@/services/dateServices"


interface DateEntry {
    date: string
    count: number
}

interface DayData {
    date: Date
    count: number
    isCurrentMonth: boolean
    isFuture: boolean
    isToday: boolean
}

export default function DateManager() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [dateEntries, setDateEntries] = useState<DateEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState<string | null>(null)

    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const today = new Date()

    // Generate years for selector (current year ± 5 years)
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    // Fetch data from backend
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

    // Update count via API
    const updateCount = async (date: string, count: number) => {
        setUpdating(date)
        try {
            await updateDateEntry(date, count)
            await getDateEntries()
        } catch (error) {
            console.error("Error updating count:", error)
        } finally {
            setUpdating(null)
        }
    }

    // Generate calendar days
    const generateCalendarDays = (): DayData[] => {
        const firstDay = new Date(currentYear, currentMonth, 1)
        const lastDay = new Date(currentYear, currentMonth + 1, 0)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - firstDay.getDay())

        const days: DayData[] = []
        const currentDate = new Date(startDate)

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const dateStr = currentDate.toLocaleDateString("en-CA")
            const entry = dateEntries.find((e) => e.date === dateStr)

            days.push({
                date: new Date(currentDate),
                count: entry?.count || 0,
                isCurrentMonth: currentDate.getMonth() === currentMonth,
                isFuture: currentDate > today,
                isToday: currentDate.toDateString() === today.toDateString(),
            })

            currentDate.setDate(currentDate.getDate() + 1)
        }

        return days
    }

    const calendarDays = generateCalendarDays()
    const totalCount = dateEntries.reduce((sum, entry) => sum + entry.count, 0)

    useEffect(() => {
        getDateEntries()
    }, [getDateEntries])

    const handleYearChange = (year: string) => {
        setCurrentDate(new Date(Number.parseInt(year), currentMonth, 1))
    }

    const handleMonthChange = (month: string) => {
        setCurrentDate(new Date(currentYear, Number.parseInt(month), 1))
    }

    const navigateMonth = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate)
        if (direction === "prev") {
            newDate.setMonth(newDate.getMonth() - 1)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setCurrentDate(newDate)
    }

    const handleCountChange = (date: Date, value: string) => {
        const count = Number.parseInt(value) || 0
        if (count >= 0) {
            const dateStr = date.toLocaleDateString("en-CA")
            updateCount(dateStr, count)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Date Count Manager
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Navigation */}
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex gap-2">
                                <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month, index) => (
                                            <SelectItem key={index} value={index.toString()}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Total Count */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Total:</span>
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                {totalCount}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day headers */}
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {calendarDays.map((day, index) => {
                                const dateStr = day.date.toISOString().split("T")[0]
                                const isUpdating = updating === dateStr

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "sm:p-2 p-1 border rounded-lg transition-colors",
                                            day.isCurrentMonth ? "bg-background" : "bg-muted/30",
                                            day.isToday && "ring-2 ring-primary",
                                            day.isFuture && "opacity-60",
                                            day.count > 0 && "bg-primary/20",
                                        )}
                                    >
                                        <div className="text-center mb-2">
                                            <span
                                                className={cn(
                                                    "text-sm",
                                                    day.isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                                                    day.isToday && "font-bold",
                                                )}
                                            >
                                                {day.date.getDate()}
                                            </span>
                                        </div>

                                        <div className="flex justify-center">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={day.count}
                                                onChange={(e) => handleCountChange(day.date, e.target.value)}
                                                disabled={!day.isCurrentMonth || day.isFuture || isUpdating}
                                                className={cn(
                                                    "h-8 text-center text-sm w-6 sm:w-16 p-0", // ✅ Adjust width: ~56px on mobile, ~64px on sm+
                                                    day.isFuture && "cursor-not-allowed",
                                                    isUpdating && "opacity-50"
                                                )}
                                                placeholder="0"
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

            {/* Legend */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded border ring-2 ring-primary"></div>
                            <span>Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-muted/30"></div>
                            <span>Other month</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-background opacity-60"></div>
                            <span>Future date (read-only)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
