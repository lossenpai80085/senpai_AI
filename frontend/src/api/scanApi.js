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

export async function getAllScans(skip = 0, limit = 20, status = null) {
    let url = `${API_BASE}/scan/scans?skip=${skip}&limit=${limit}`
    if (status) url += `&status=${status}`

    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to get scans")
    return response.json()
}

export async function downloadPdfReport(scanId) {
    const response = await fetch(`${API_BASE}/scan/${scanId}/report/pdf`)
    if (!response.ok) throw new Error("Failed to generate PDF")

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `senpai-ai-report-${scanId}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}
