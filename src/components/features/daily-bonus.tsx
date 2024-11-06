"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export function DailyBonus() {
  const [currentDay, setCurrentDay] = useState(1)
  const days = [1, 2, 3, 4, 5, 6, 7]

  const getBonusAmount = (day: number) => (day * 100)

  const handleClaim = async () => {
    // TODO: Implement bonus claiming
    console.log(`Claiming bonus for day ${currentDay}`)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Daily Bonus</h2>
      <div className="flex gap-2 mb-4">
        {days.map((day) => (
          <div
            key={day}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2",
              currentDay === day
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <Button onClick={handleClaim}>
        Claim {getBonusAmount(currentDay)} coins
      </Button>
    </div>
  )
}