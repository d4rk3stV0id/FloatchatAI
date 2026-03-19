import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/providers/ThemeProvider" // --- Use the new provider hook ---

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex items-center gap-2">
        <Sun className="h-5 w-5 text-muted-foreground"/>
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-14 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center relative"
        >
            <div className={`w-6 h-6 rounded-full bg-background shadow-md transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-3' : '-translate-x-3'}`}/>
        </Button>
        <Moon className="h-5 w-5 text-muted-foreground"/>
    </div>
  )
}

export default ThemeToggle;

