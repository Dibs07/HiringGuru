"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Plus, User, Briefcase, Target, Github, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { apiService } from "@/lib/services/api-service"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"

interface UserOnboardingProps {
  onComplete: (data: any) => void
  onSkip: () => void
}

export function UserOnboarding({ onComplete, onSkip }: UserOnboardingProps) {
    const { user, refreshProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [githubData, setGithubData] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    skills: [] as string[],
    targetRole: "",
    experience: "",
    currentCompany: "",
    education: "",
    location: "",
    bio: "",
    dreamCompanies: [] as string[],
    dreamJobRole: "",
  })
  const [skillInput, setSkillInput] = useState("")
  const [companyInput, setCompanyInput] = useState("")

  useEffect(() => {
    if (user?.authProvider === "github" && user?.email) {
      fetchGitHubData()
    }
  }, [user])

  const fetchGitHubData = async () => {
    try {
      setIsLoading(true)
      const username = user?.email?.split("@")[0] || user?.name?.toLowerCase().replace(/\s+/g, "")
      console.log('Fetching GitHub data for username:', username);
      
      if (username) {
        const response = await apiService.getGitHubProfile(username)
        console.log('GitHub API response:', response);
        setGithubData(response)

        // Only update fields if they are currently empty AND GitHub data is available
        setFormData((prev) => {
          const updated = {
            ...prev,
            fullName: prev.fullName || (response.profile?.name || ""),
            skills: prev.skills.length ? prev.skills : (response.skills || []),
            location: prev.location || (response.profile?.location || ""),
            bio: prev.bio || (response.profile?.bio || ""),
          };
          console.log('Updated form data with GitHub info:', updated);
          return updated;
        })
      }
    } catch (error) {
      console.error("Failed to fetch GitHub data:", error)
      toast.error("Could not fetch GitHub profile data")
      // Don't update form data if there's an error
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }))
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleAddCompany = () => {
    const trimmed = companyInput.trim()
    if (trimmed && !formData.dreamCompanies.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        dreamCompanies: [...prev.dreamCompanies, trimmed],
      }))
      setCompanyInput("")
    }
  }

  const handleRemoveCompany = (company: string) => {
    setFormData((prev) => ({
      ...prev,
      dreamCompanies: prev.dreamCompanies.filter((c) => c !== company),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: "skill" | "company") => {
    if (e.key === "Enter") {
      e.preventDefault()
      type === "skill" ? handleAddSkill() : handleAddCompany()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('Submitting onboarding form with data:', formData);

    try {
      if (githubData) {
        const analysisPayload = {
          githubUsername: githubData.profile.login,
          skills: formData.skills,
          contributionFreq: JSON.stringify(githubData.contributionFreq),
          projectsCount: githubData.projectsCount,
          topLanguages: githubData.topLanguages,
          recentActivity: githubData.recentActivity,
          repositoryStats: githubData.repositoryStats,
          targetRole: formData.dreamJobRole,
          dreamCompanies: formData.dreamCompanies,
        }
        console.log('Submitting GitHub analysis:', analysisPayload);

        await apiService.submitUserAnalysis(analysisPayload)
        await refreshProfile()
      }

      console.log('Onboarding completed successfully');
      onComplete(formData)
      toast.success("Profile setup completed successfully!")
    } catch (error) {
      console.error("Failed to submit analysis:", error)
      toast.error("Failed to complete profile setup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto"
            >
              <User className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Welcome to Hiring Guru!</CardTitle>
            <p className="text-gray-600">
              Help us personalize your interview preparation experience by sharing a few details about yourself.
            </p>
            <div className="flex justify-center">
              <Button variant="ghost" onClick={onSkip} className="text-sm text-gray-500">
                Skip for now →
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* GitHub Profile Preview */}
            {githubData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={githubData.profile.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      <Github className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{githubData.profile.name}</h3>
                    <p className="text-gray-600">@{githubData.profile.login}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {githubData.profile.location}
                      </span>
                      <span>{githubData.profile.public_repos} repos</span>
                      <span>{githubData.profile.followers} followers</span>
                    </div>
                  </div>
                </div>
                {githubData.profile.bio && <p className="text-gray-700 mb-3">{githubData.profile.bio}</p>}
                <div className="flex flex-wrap gap-2">
                  {githubData.skills.slice(0, 6).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    disabled={false}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="targetRole" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Target Job Role
                  </Label>
                  <Input
                    id="targetRole"
                    value={formData.targetRole || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetRole: e.target.value }))}
                    placeholder="e.g., Software Engineer, Product Manager"
                    disabled={false}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g., 2-3 years, Fresh Graduate"
                    disabled={false}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="currentCompany" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Current Company (Optional)
                  </Label>
                  <Input
                    id="currentCompany"
                    value={formData.currentCompany || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentCompany: e.target.value }))}
                    placeholder="e.g., Google, Microsoft, Startup"
                    disabled={false}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="education">Education Background</Label>
                  <Input
                    id="education"
                    value={formData.education || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
                    placeholder="e.g., B.Tech Computer Science, MBA"
                    disabled={false}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, Remote"
                    disabled={false}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <Label htmlFor="skills">Skills & Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput || ""}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "skill")}
                    placeholder="Type a skill and press Enter"
                    className="flex-1"
                    disabled={false}
                  />
                  <Button type="button" onClick={handleAddSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-3"
              >
                <Label htmlFor="dreamCompanies">Dream Companies</Label>
                <div className="flex gap-2">
                  <Input
                    id="dreamCompanies"
                    value={companyInput || ""}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "company")}
                    placeholder="Type a company and press Enter"
                    className="flex-1"
                    disabled={false}
                  />
                  <Button type="button" onClick={handleAddCompany} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.dreamCompanies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.dreamCompanies.map((company, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {company}
                        <button
                          type="button"
                          onClick={() => handleRemoveCompany(company)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="space-y-2"
              >
                <Label htmlFor="dreamJobRole">Dream Job Role</Label>
                <Input
                  id="dreamJobRole"
                  value={formData.dreamJobRole || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dreamJobRole: e.target.value }))}
                  placeholder="e.g., Senior Frontend Developer, Tech Lead"
                  disabled={false}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="pt-4"
              >
                <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={isLoading}>
                  {isLoading ? "Setting up your profile..." : "Complete Setup & Start Preparing"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
