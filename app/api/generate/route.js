import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    const apiKey = process.env.RECRAFT_API_KEY
    if (!apiKey) {
      throw new Error('Recraft API key is not configured')
    }

    console.log('Making request to Recraft API...') // Debug log

    const response = await fetch('https://external.api.recraft.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,  // Changed to Authorization header with Bearer
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Create an accessible ${assetType}: ${prompt}. Make it high contrast, simple, and clear.`,
        n: 1,
        size: '1024x1024',
        model: 'recraftv3',
        style: 'digital_illustration',
        response_format: 'url'
      })
    })

    console.log('Response status:', response.status) // Debug log

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Recraft API error:', errorText)
      throw new Error(`Recraft API request failed: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Recraft response:', responseData) // Debug log

    const assets = responseData.data ? responseData.data.map(item => ({
      url: item.url,
      type: assetType,
      accessibilityScore: 0.95
    })) : []

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
