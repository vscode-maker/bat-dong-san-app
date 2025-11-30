class APIMonitor {
  private static instance: APIMonitor
  private callCounts: Map<string, number> = new Map()
  private callTimes: Map<string, Date[]> = new Map()
  private callStacks: Map<string, string[]> = new Map()

  static getInstance(): APIMonitor {
    if (!APIMonitor.instance) {
      APIMonitor.instance = new APIMonitor()
    }
    return APIMonitor.instance
  }

  logAPICall(endpoint: string) {
    // Get call stack to identify where the call came from
    const stack = new Error().stack?.split("\n").slice(2, 6).join("\n") || "Unknown"

    // Increment call count
    const currentCount = this.callCounts.get(endpoint) || 0
    this.callCounts.set(endpoint, currentCount + 1)

    // Log call time
    const times = this.callTimes.get(endpoint) || []
    times.push(new Date())
    this.callTimes.set(endpoint, times)

    // Log call stack
    const stacks = this.callStacks.get(endpoint) || []
    stacks.push(stack)
    this.callStacks.set(endpoint, stacks)

    // Console warning if called multiple times
    if (currentCount > 0) {
      console.warn(`🚨 API CALL DUPLICATE: ${endpoint} called ${currentCount + 1} times!`)
      console.warn(
        "Call times:",
        times.map((t) => t.toISOString()),
      )
      console.warn("Latest call stack:", stack)
      console.warn("All call stacks:", stacks)
    } else {
      console.log(`✅ API CALL: ${endpoint} (first time)`)
    }
  }

  getReport() {
    const report: any = {}
    this.callCounts.forEach((count, endpoint) => {
      report[endpoint] = {
        count,
        times: this.callTimes.get(endpoint)?.map((t) => t.toISOString()) || [],
        stacks: this.callStacks.get(endpoint) || [],
      }
    })
    return report
  }

  reset() {
    this.callCounts.clear()
    this.callTimes.clear()
    this.callStacks.clear()
    console.log("🔄 API Monitor reset")
  }

  // Check if any endpoint has been called more than once
  hasDuplicates(): boolean {
    for (const count of this.callCounts.values()) {
      if (count > 1) return true
    }
    return false
  }

  // Get duplicate endpoints
  getDuplicates(): string[] {
    const duplicates: string[] = []
    this.callCounts.forEach((count, endpoint) => {
      if (count > 1) {
        duplicates.push(`${endpoint} (${count} times)`)
      }
    })
    return duplicates
  }
}

export const apiMonitor = APIMonitor.getInstance()

// Global functions để check API calls từ console
if (typeof window !== "undefined") {
  ;(window as any).checkAPICalls = () => {
    console.log("📊 API Call Report:", apiMonitor.getReport())

    if (apiMonitor.hasDuplicates()) {
      console.warn("🚨 DUPLICATE CALLS DETECTED:")
      console.warn(apiMonitor.getDuplicates())
    } else {
      console.log("✅ No duplicate calls detected")
    }
  }
  ;(window as any).resetAPIMonitor = () => {
    apiMonitor.reset()
  }
  ;(window as any).checkDuplicates = () => {
    if (apiMonitor.hasDuplicates()) {
      console.warn("🚨 DUPLICATE CALLS:", apiMonitor.getDuplicates())
    } else {
      console.log("✅ No duplicates")
    }
  }
}
