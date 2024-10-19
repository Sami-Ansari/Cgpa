"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Semester {
  creditHours: string
  gpa: string
}

export default function Component() {
  const [numSemesters, setNumSemesters] = useState<number>(0)
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [cgpa, setCgpa] = useState<string | null>(null)

  const handleSemesterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setNumSemesters(value)
    setSemesters(Array.from({ length: value }, () => ({ creditHours: "", gpa: "" })))
  }

  const handleSemesterDetailChange = (index: number, field: keyof Semester, value: string) => {
    const updatedSemesters = [...semesters]
    updatedSemesters[index][field] = value
    setSemesters(updatedSemesters)
  }

  const calculateCGPA = () => {
    let totalGpaCredits = 0
    let totalCreditHours = 0

    semesters.forEach((semester) => {
      const creditHours = parseFloat(semester.creditHours)
      const gpa = parseFloat(semester.gpa)

      if (!isNaN(creditHours) && !isNaN(gpa)) {
        totalGpaCredits += gpa * creditHours
        totalCreditHours += creditHours
      }
    })

    if (totalCreditHours > 0) {
      const calculatedCGPA = totalGpaCredits / totalCreditHours
      setCgpa(calculatedCGPA.toFixed(2))
    } else {
      setCgpa(null)
    }
  }

  const removeSemester = (index: number) => {
    const updatedSemesters = semesters.filter((_, i) => i !== index)
    setSemesters(updatedSemesters)
    setNumSemesters(updatedSemesters.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">CGPA Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="numSemesters">Number of Semesters</Label>
              <Input
                id="numSemesters"
                type="number"
                value={numSemesters}
                onChange={handleSemesterChange}
                className="mt-1"
              />
            </div>
            {semesters.map((semester, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white rounded-lg shadow-md relative"
              >
                <h2 className="text-lg font-semibold mb-2">Semester {index + 1}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`creditHours-${index}`}>Credit Hours</Label>
                    <Input
                      id={`creditHours-${index}`}
                      type="number"
                      value={semester.creditHours}
                      onChange={(e) => handleSemesterDetailChange(index, "creditHours", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`gpa-${index}`}>GPA</Label>
                    <Input
                      id={`gpa-${index}`}
                      type="number"
                      step="0.01"
                      value={semester.gpa}
                      onChange={(e) => handleSemesterDetailChange(index, "gpa", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeSemester(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            <Button onClick={calculateCGPA} className="w-full">
              Calculate CGPA
            </Button>
            {cgpa !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-4 bg-primary text-primary-foreground rounded-lg shadow-lg text-center"
              >
                <h2 className="text-2xl font-semibold">
                  Your CGPA is: <span className="font-bold">{cgpa}</span>
                </h2>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}