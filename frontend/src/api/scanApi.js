const API_BASE = "http://localhost:8000/api/v1"

export async function startScan(url, modules) {
    const response = await fetch(`${API_BASE}/scan/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, modules })
    })
    if (!response.ok) throw new Error("Failed to start scan")
    return response.json()
}

export async function getScanStatus(scanId) {
    const response = await fetch(`${API_BASE}/scan/status/${scanId}`)
    if (!response.ok) throw new Error("Failed to get status")
    return response.json()
}

export async function getScanResult(scanId) {
    const response = await fetch(`${API_BASE}/scan/result/${scanId}`)
    if (!response.ok) throw new Error("Failed to get result")
    return response.json()
}

export async function chatWithScan(scanId, question) {
    const response = await fetch(`${API_BASE}/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scan_id: scanId, question })
    })
    if (!response.ok) throw new Error("Failed to chat")
    return response.json()
}
