import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent blur-xl animate-pulse" />
          <LoadingSpinner size="lg" className="relative z-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground animate-fade-in">Loading Experience</h2>
          <p className="text-muted-foreground animate-fade-in">Preparing something amazing...</p>
        </div>
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}